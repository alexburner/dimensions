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
  console.log('Worker message', e)
  context.postMessage({ bar: 'foo' })
  if (!(e && e.data && e.data.type)) return
  switch (e.data.type) {
    case 'request': {
      particles = makeParticles(
        e.data.request.dimensionCount,
        e.data.request.particleCount,
        particles,
      )
      currRequest = e.data.request
      tick()
    }
    case 'destroy': {
      currRequest = undefined
      self.close()
    }
  }
})

const tick = () => {
  if (!currRequest) return
}
