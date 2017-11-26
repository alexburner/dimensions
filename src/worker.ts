import { makeParticles } from 'src/geometry/particles'
import { Force, Neighbor, Particle, WorkerRequest } from 'src/interfaces'

const context: Worker = self as any
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
    }
    case 'destroy': {
      currRequest = undefined
    }
  }
})

const tick = () => {
  if (!currRequest) return
}
