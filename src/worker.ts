import { LayerName } from 'src/drawing/layers'
import { behaviors, BehaviorSpecs } from 'src/particles/behaviors'
import { BoundingName, boundingNames, boundings } from 'src/particles/boundings'
import {
  getNeighborhood,
  Neighborhood,
  NeighborhoodSpecs,
} from 'src/particles/neighborhoods'
import ParticleMsg from 'src/particles/ParticleMsg'
import System from 'src/particles/System'

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
  neighborhood: Neighborhood
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
  request: WorkerRequest | undefined
  system: System
} = {
  request: undefined,
  system: new System(),
}

/**
 * Handle messages from main browser thread
 */
context.addEventListener('message', e => {
  if (!(e && e.data && e.data.type)) return
  switch (e.data.type) {
    case 'request': {
      state.request = e.data.request as WorkerRequest
      state.system.setPopulation(
        state.request.particles,
        state.request.dimensions,
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
      // pass-through from request
      dimensions: state.request.dimensions,
      layers: state.request.layers,
      // derived from particle system
      particles: state.system.particles.map(p => new ParticleMsg(p)),
      neighborhood: getNeighborhood(
        state.system.particles,
        state.request.neighborhood,
      ),
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
 */
const tick = () => {
  if (!state.request) return

  // Reset accelerations
  state.system.particles.forEach(p => p.acceleration.multiply(0))

  {
    // Apply behavior
    const spec = state.request.behavior
    const behavior = behaviors[spec.name]
    behavior(state.system, spec.config)
  }

  // Apply boundings
  boundingNames.forEach(boundingName => {
    if (!state.request) return
    const bounding = boundings[boundingName]
    const boundingVisible = state.request.boundings[boundingName]
    if (boundingVisible) bounding(state.system)
  })

  // Update positions
  state.system.particles.forEach(p => {
    if (!state.request) return
    p.velocity.add(p.acceleration)
    p.velocity.limit(state.request.max.speed)
    p.position.add(p.velocity)
  })

  // [TODO] Apply wrapping

  // Update system
  state.system.recalculate()

  // Update host thread
  sendUpdate()
}
