import { makeParticles } from 'src/geometry/particles'
import { Force, Neighbor, Particle, WorkerRequest } from 'src/interfaces'

// XXX: TypeScript currently does not support loading both "DOM" and "WebWorker"
// type definitions (in the tsconfig "lib" field), so we are sadly falling back
// to weird partial types hacked out of the desired definitions file. Actual:
// https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope
const context = (self as any) as DedicatedWorkerGlobalScope
let currRequest: WorkerRequest | undefined
let particles: Particle[] = []

context.addEventListener('message', e => {
  if (!(e && e.data && e.data.type)) return
  switch (e.data.type) {
    case 'request': {
      particles = makeParticles(
        e.data.request.dimensions,
        e.data.request.particles,
        particles,
      )
      currRequest = e.data.request
      loop()
      break
    }
    case 'destroy': {
      currRequest = undefined
      break
    }
  }
})

const loop = () => {
  // Abort if no request
  if (!currRequest) return

  // TODO run force here

  // Update main thread
  context.postMessage({
    type: 'tick',
    response: {
      layers: currRequest.layers,
      particles,
    }
  })

  // Async to allow interrupt
  setTimeout(loop, 100)
}
