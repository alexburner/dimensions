import { WorkerOptions, WorkerResponse } from 'src/options'
import { behaviors } from 'src/particles/behaviors'
import { boundingNames, boundings } from 'src/particles/boundings'
import ParticleMsg from 'src/particles/ParticleMsg'
import System from 'src/particles/System'

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
} = {
  options: undefined,
  system: new System(),
}

/**
 * Handle messages from main browser thread
 */
context.addEventListener('message', e => {
  if (!(e && e.data && e.data.type)) return
  switch (e.data.type) {
    case 'update': {
      state.options = e.data.options as WorkerOptions
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
const sendUpdate = () => {
  if (!state.options) return
  context.postMessage<{
    type: 'update'
    response: WorkerResponse
  }>({
    type: 'update',
    response: {
      dimensions: state.options.dimensions,
      particles: state.system.particles.map(p => new ParticleMsg(p)),
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
const tick = () => {
  if (!state.options) return

  // Reset accelerations
  state.system.particles.forEach(p => p.acceleration.multiply(0))

  {
    // Apply behavior
    const spec = state.options.behavior
    const behavior = behaviors[spec.name]
    behavior(state.system, spec.config)
  }

  // Update positions
  state.system.particles.forEach(p => {
    if (!state.options) return
    p.velocity.add(p.acceleration)
    p.velocity.limit(state.options.max.speed)
    p.position.add(p.velocity)
  })

  // Apply boundings
  boundingNames.forEach(name => {
    if (!state.options) return
    const bounding = boundings[name]
    const boundingVisible = state.options.boundings[name]
    if (boundingVisible) bounding(state.system)
  })

  // [TODO] Apply wrapping

  // Update system
  state.system.recalculate()

  // Update host thread
  sendUpdate()
}
