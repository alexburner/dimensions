import { LayerName } from 'src/drawing/layers'
import { behaviors, BehaviorSpecs } from 'src/geometry/behaviors'
import { BoundingName, boundingNames, boundings } from 'src/geometry/boundings'
import { neighborhoods, NeighborhoodSpecs } from 'src/geometry/neighborhoods'
import { makeParticles, ParticleMsg, ParticleN } from 'src/geometry/particles'

export interface WorkerRequest {
  dimensions: number
  particles: number
  max: {
    force: number
    speed: number
  }
  behavior: BehaviorSpecs
  neighborhood: NeighborhoodSpecs
  boundings: { [name in BoundingName]: boolean }
  layers: { [name in LayerName]: boolean }
}

export interface WorkerResponse {
  dimensions: number
  particles: ParticleMsg[]
  layers: { [name in LayerName]: boolean }
}

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
  particles: ParticleN[]
  request: WorkerRequest | undefined
} = {
  particles: [],
  request: undefined,
}

/**
 * Handle messages from main browser thread
 */
context.addEventListener('message', e => {
  if (!(e && e.data && e.data.type)) return
  switch (e.data.type) {
    case 'request': {
      state.request = e.data.request as WorkerRequest
      state.particles = makeParticles(
        state.request.dimensions,
        state.request.particles,
        state.particles,
      )
      tick()
      break
    }
    case 'request.tick': {
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
  if (!state.request) return
  context.postMessage<{
    type: 'update'
    response: WorkerResponse
  }>({
    type: 'update',
    response: {
      particles: state.particles.map(p => new ParticleMsg(p)),
      dimensions: state.request.dimensions,
      layers: state.request.layers,
    },
  })
}

/**
 * Particle physics tick
 * 0. (assume up-to-date system)
 * 1. reset accelerations
 * 2. accumulate behavior acceleration
 * 3. accumulate bounding acceleration
 * 4. update positions
 *     a. add acceleration to velocity
 *     b. apply speed limit to velocity
 *     c. add velocities to positions
 *     d. apply wrapping (if flagged)
 * 5. measure updated system
 *     a. find centroid
 *     b. find all of each particle's neighbors { index, distance }
 *     c. sort all of each particle's neighbors by distance (asc)
 * 6. prepare for transport
 *     a. filter neighbors by neighborhood (all, nearest, local, etc)
 *     b. convert ParticleN objects to ParticleMsg objects
 */
const tick = () => {
  if (!state.request) return

  // Reset accelerations
  state.particles.forEach(p => p.acceleration.multiply(0))

  {
    // Apply behavior
    const spec = state.request.behavior
    const behavior = behaviors[spec.name]
    behavior(state.particles, spec.config)
  }

  // Apply boundings
  boundingNames.forEach(boundingName => {
    if (!state.request) return
    const bounding = boundings[boundingName]
    const boundingVisible = state.request.boundings[boundingName]
    if (boundingVisible) bounding(state.particles)
  })

  // Update positions
  state.particles.forEach(p => {
    if (!state.request) return
    p.acceleration.limit(state.request.max.force) // TODO move to individual algos
    p.velocity.add(p.acceleration)
    p.velocity.limit(state.request.max.speed)
    p.position.add(p.velocity)
  })

  // [TODO] Apply wrapping

  {
    // Find neighbors
    const spec = state.request.neighborhood
    const neighborhood = neighborhoods[spec.name]
    neighborhood(state.particles, spec.config)
  }

  // Update host thread
  sendUpdate()
}

/**
 * particles/
 *   behaviors/
 *   boundings/
 *   neighborhoods/
 *   ParticleN
 *   ParticleMsg
 *   Particle3
 *   System
 *
 * VectorN
 *
 *
 *
 *  System
 *    - centroid // average of all particle positions
 *    - furthest // longest distance between any two particles
 *    - updateNeighbors() // mutates each particle with neighbor distances
 *    - getNeighborhood(spec) // map of particle index -> filtered neighbors
 *
 *  Remove "neighbors" from ParticleMsg
 *  Pass separate "Neighborhood" instead
 *  { [particleIndex: number]: Neighbor[] }
 *
 *
 *
 *  algos (behavior, bounding)
 *    - name
 *    - config
 *    - function
 *
 *  options
 *    - behavior (+config)
 *    - boundings
 *    - neighborhoods (+config, for proximity)
 *    - layers (+config, for colors)
 *
 *
 *  also, configuragble field size?
 *
 *
 *
 */
