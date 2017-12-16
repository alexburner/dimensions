import { Neighborhood } from 'src/geometry/neighborhoods'
import { Neighbor, ParticleN } from 'src/geometry/particles'
import VectorN from 'src/geometry/VectorN'

interface Config {}

export interface Spec {
  name: 'nearest'
  config: Config
}

export const nearest: Neighborhood<Config> = (
  particles: ParticleN[],
): ParticleN[] => {
  if (particles.length < 2) return particles
  particles.forEach(
    particle =>
      (particle.neighbors = [findNearestNeighbor(particle, particles)]),
  )

  // TODO update types to reflect mutation-over-creation?
  return particles
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
