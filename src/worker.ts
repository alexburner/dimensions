import { MAX_RADIUS } from 'src/constants'
import { WorkerOptions, WorkerResponse } from 'src/options'
import { behaviors } from 'src/particles/behaviors'
import { boundings } from 'src/particles/boundings'
import ParticleMsg from 'src/particles/ParticleMsg'
import ParticleN from 'src/particles/ParticleN'
import System from 'src/particles/System'
import VectorN from 'src/particles/VectorN'

/**
 * TypeScript currently does not support loading both "DOM" and "WebWorker"
 * type definitions (in the tsconfig "lib" field), so we are falling back
 * to weird partial types hacked out of the desired definitions file
 *
 * Hack:
 * node_modules/typescript/lib/lib.webworker.d.ts -> typings/custom.d.ts
 *
 * Actual:
 * https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope
 */
const context = (self as any) as DedicatedWorkerGlobalScope

/**
 * State stored as global singleton due to the nature of web workers
 * (think of this as a class instantiated on `new WebpackWorkerLoader()`)
 */
const state: {
  options: WorkerOptions | undefined
  system: System

  // hacks for orbits
  prev: {
    orbits: boolean
    dimensions: number | undefined
  }
} = {
  options: undefined,
  system: new System(),
  prev: {
    orbits: false,
    dimensions: undefined,
  },
}

/**
 * Handle messages from main browser thread
 */
context.addEventListener('message', (e: MessageEvent) => {
  const data = JSON.parse(e.data)
  if (!(data && data.type)) return
  switch (data.type) {
    case 'update': {
      state.options = data.options as WorkerOptions
      state.system.setPopulation(
        state.options.particles,
        state.options.dimensions,
      )
      tick()
      break
    }
    case 'update.tick': {
      tick()
      break
    }
    case 'destroy': {
      context.close()
      break
    }
  }
})

/**
 * Send WorkerResponse back to main browser thread
 */
const sendUpdate = (): void => {
  if (!state.options) return
  context.postMessage<{
    type: 'update'
    response: WorkerResponse
  }>({
    type: 'update',
    response: {
      dimensions: state.options.dimensions,
      particles: state.system.particles.map(
        (p: ParticleN) => new ParticleMsg(p),
      ),
      neighborhood: state.system.getNeighborhoodMsg(state.options.neighborhood),
    },
  })
}

/**
 * Particle physics tick
 * 0. (assume up-to-date system)
 * 1. reset accelerations
 * 2. accumulate behavior acceleration
 * 3. accumulate bounding acceleration [XXX currently bounds just teleport]
 * 4. update positions
 *     a. add acceleration to velocity
 *     b. apply speed limit to velocity
 *     c. add velocities to positions
 *     d. apply wrapping (if flagged)
 * 5. measure updated system
 *     a. find centroid
 *     b. find all of each particle's neighbors { index, distance }
 *     c. sort all of each particle's neighbors by distance (asc)
 */
const tick = (): void => {
  if (!state.options) return // TS will lose this in nested functions

  // Reset accelerations
  state.system.particles.forEach((p: ParticleN) => p.acceleration.multiply(0))

  {
    /**
     * BEGIN ORBIT HACKS
     */
    const isOrbits = state.options.behavior.name === 'orbits'
    const dimensions = state.options.dimensions
    const maxSpeed = state.options.max.speed
    if (isOrbits) {
      // Randomize particle velocities if noorbits->orbits
      if (!state.prev.orbits) {
        state.system.particles.forEach((p: ParticleN) =>
          p.velocity.randomize(maxSpeed),
        )
      }
      // Randomize particle positions & velocity if dimensions have increased
      if (
        state.prev.dimensions !== undefined &&
        state.prev.dimensions < dimensions
      ) {
        state.system.particles.forEach((p: ParticleN) => {
          randomizeHigherDimensions(dimensions, p.position, MAX_RADIUS)
          randomizeHigherDimensions(dimensions, p.velocity, maxSpeed)
        })
      }
    }
    // Update prev state
    state.prev.orbits = isOrbits
    state.prev.dimensions = dimensions
    /**
     * END ORBIT HACKS
     */
  }

  {
    // Apply particle behavior
    const spec = state.options.behavior
    const behavior = behaviors[spec.name]
    behavior(state.system, spec.config)
  }

  // Update positions
  state.system.particles.forEach((p: ParticleN) => {
    if (!state.options) return
    p.velocity.add(p.acceleration)
    p.velocity.limitMagnitude(state.options.max.speed)
    p.position.add(p.velocity)
  })

  {
    // Apply boundary behavior
    const bounding = boundings[state.options.bounding]
    bounding(state.system)
  }

  // [TODO] Apply wrapping

  // Update system
  state.system.recalculate()

  // Update host thread
  sendUpdate()
}

// For use when a vector is being moved to a higher dimension
// and you want those higher-D values to be randomized (instead of zero)
// while still maintaining any original values from lower dimensions
const randomizeHigherDimensions = (
  dimensions: number,
  vector: VectorN,
  k?: number,
): void => {
  // Duplicate vector
  const copy = vector.clone()
  // Randomize vector
  vector.radialRandomize(k)
  // Restore any original values
  vector.mutate(
    (v: number, i: number) => (i + 1 < dimensions ? copy.getValue(i) : v),
  )
}
