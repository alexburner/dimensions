import { FIELD_SIZE } from 'src/constants'
import { LayerEnabled } from 'src/drawing/layers'
import { behaviors, BehaviorSpecs } from 'src/geometry/behaviors'
import {
  BoundingEnabled,
  boundingNames,
  boundings,
} from 'src/geometry/boundings'
import { neighborhoods, NeighborhoodSpecs } from 'src/geometry/neighborhoods'
import { makeParticles, ParticleN } from 'src/geometry/particles'

export interface WorkerRequest {
  dimensions: number
  particles: number
  max: {
    force: number
    speed: number
  }
  behavior: BehaviorSpecs
  neighborhood: NeighborhoodSpecs
  boundings: BoundingEnabled
  layers: LayerEnabled
}

export interface WorkerResponse {
  dimensions: number
  particles: ParticleN[]
  layers: LayerEnabled
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
        FIELD_SIZE,
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
      particles: state.particles,
      dimensions: state.request.dimensions,
      layers: state.request.layers,
    },
  })
}

/**
 * Particle physics tick
 * - runs chosen behavior
 * - runs chosen boundings
 * - runs chosen neighborhood
 * - posts message with updated particles
 */
const tick = () => {
  if (!state.request) return

  // Reset particle accelerations
  state.particles.forEach(p => p.acceleration.multiply(0))

  {
    // Accumulate acceleration from behavior
    const spec = state.request.behavior
    const behavior = behaviors[spec.name]
    behavior(state.particles, spec.config)
  }

  // Accumulate acceleration from boundings
  boundingNames.forEach(boundingName => {
    const bounding = boundings[boundingName]
    const boundingVisible = state.request!.boundings[boundingName]
    if (boundingVisible) bounding(state.particles)
  })

  // Apply force limits to accelerations
  state.particles.forEach(p => p.acceleration.limit(state.request!.max.force))

  // Apply accelerations to velocities
  state.particles.forEach(p => p.velocity.add(p.acceleration))

  // Apply speed limits to velocities
  state.particles.forEach(p => p.velocity.limit(state.request!.max.speed))

  // Apply velocities to positions
  state.particles.forEach(p => p.position.add(p.velocity))

  // [TODO] Apply wrapping

  {
    // Find & annotate particle neighbors
    const spec = state.request.neighborhood
    const neighborhood = neighborhoods[spec.name]
    neighborhood(state.particles, spec.config)
  }

  // Update main thread
  sendUpdate()
}
