import { Neighborhood } from 'src/particles/neighborhoods'
import ParticleN from 'src/particles/ParticleN'
import { Neighbor } from 'src/particles/System'
import VectorN from 'src/particles/VectorN'

interface Config {}

export interface Spec {
  name: 'nearest'
  config: Config
}

export const nearest: Neighborhood<Config> = (particles: ParticleN[]) => {
  if (particles.length < 2) return particles
  particles.forEach(
    particle =>
      (particle.neighbors = [findNearestNeighbor(particle, particles)]),
  )
}

export const findNearestNeighbor = (
  particle: ParticleN,
  particles: ParticleN[],
): Neighbor => {
  let minDistance: number = Infinity
  let minIndex: number = -1
  particles.forEach((other, index) => {
    if (particle === other) return
    const distance = VectorN.getDistance(particle.position, other.position)
    if (distance < minDistance) {
      minDistance = distance
      minIndex = index
    }
  })
  return {
    distance: minDistance,
    index: minIndex,
  }
}
