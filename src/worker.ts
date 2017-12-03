import { FIELD_SIZE } from 'src/constants'
import neighbors from 'src/geometry/neighbors'
import { makeParticles, Particle } from 'src/geometry/particles'
import { WorkerRequest, WorkerResponse } from 'src/interfaces'

// XXX: TypeScript currently does not support loading both "DOM" and "WebWorker"
// type definitions (in the tsconfig "lib" field), so we are sadly falling back
// to weird partial types hacked out of the desired definitions file. Actual:
// https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope
const context = (self as any) as DedicatedWorkerGlobalScope

const curr: {
  particles: Particle[]
  request: WorkerRequest | undefined
} = {
  particles: [],
  request: undefined,
}

context.addEventListener('message', e => {
  if (!(e && e.data && e.data.type)) return
  switch (e.data.type) {
    case 'request': {
      const request: WorkerRequest = e.data.request
      curr.request = request
      curr.particles = makeParticles(
        FIELD_SIZE,
        request.dimensions,
        request.particles,
        curr.particles,
      )
      loop()
      break
    }
    case 'destroy': {
      curr.request = undefined
      break
    }
  }
})

const loop = () => {
  // Abort if no request
  if (!curr.request) return

  // TODO run force here

  // TODO centering & scaling

  // TODO better neighbor rule handling
  neighbors.nearest(curr.particles)

  // Update main thread
  context.postMessage<{
    type: 'tick'
    response: WorkerResponse
  }>({
    type: 'tick',
    response: {
      particles: curr.particles,
      dimensions: curr.request.dimensions,
      layerVisibility: curr.request.layerVisibility,
    },
  })

  // Async to allow interrupt
  // setTimeout(loop, 0)
}
