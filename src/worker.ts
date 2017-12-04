import { each } from 'lodash'

import { FIELD_SIZE } from 'src/constants'
import { LayerEnabled } from 'src/drawing/layers'
import {
  BoundingEnabled,
  boundingNameList,
  boundings,
} from 'src/geometry/boundings'
import { neighborhoods, NeighborhoodSpec } from 'src/geometry/neighborhoods'
import { makeParticles, Particle } from 'src/geometry/particles'
import { simulations, SimulationSpec } from 'src/geometry/simulations'

export interface WorkerRequest {
  dimensions: number
  particles: number
  simulation: SimulationSpec
  neighborhood: NeighborhoodSpec
  boundings: BoundingEnabled
  layers: LayerEnabled
}

export interface WorkerResponse {
  dimensions: number
  particles: Particle[]
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
  particles: Particle[]
  request: WorkerRequest | undefined
  stopped: boolean
} = {
  particles: [],
  request: undefined,
  stopped: false,
}

context.addEventListener('message', e => {
  if (!(e && e.data && e.data.type)) return
  switch (e.data.type) {
    case 'request': {
      const request: WorkerRequest = e.data.request
      state.request = request
      state.particles = makeParticles(
        FIELD_SIZE,
        request.dimensions,
        request.particles,
        state.particles,
      )
      loop()
      break
    }
    case 'pause': {
      state.stopped = true
      break
    }
    case 'resume': {
      state.stopped = false
      loop()
      break
    }
    case 'destroy': {
      state.stopped = true
      context.close()
      break
    }
  }
})

const loop = () => {
  if (!state.request) return
  if (state.stopped) return

  {
    // Run simulation
    const spec = state.request.simulation
    const simulation = simulations[spec.name]
    const config = spec.config
    state.particles = simulation(state.particles, config)
  }

  // Run boundings (in order)
  each(boundingNameList, name => {
    if (!state.request) return // XXX tsc bug
    if (!state.request.boundings[name]) return
    state.particles = boundings[name](state.particles)
  })

  {
    // Run neighborhood
    const spec = state.request.neighborhood
    const neighborhood = neighborhoods[spec.name]
    const config = spec.config
    state.particles = neighborhood(state.particles, config)
  }

  // Update main thread
  context.postMessage<{
    type: 'tick'
    response: WorkerResponse
  }>({
    type: 'tick',
    response: {
      particles: state.particles,
      dimensions: state.request.dimensions,
      layers: state.request.layers,
    },
  })

  // Async to allow interrupt
  setTimeout(loop, 1000 / 60)
}
