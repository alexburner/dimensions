import { each, map } from 'lodash'

import { Neighborhood } from 'src/geometry/neighborhoods'
import { Neighbor, Particle } from 'src/geometry/particles'
import { getDistance } from 'src/geometry/vector-n'

interface Config {}

export interface Spec {
  name: 'nearest'
  config: Config
}

export const nearest: Neighborhood<Config> = (
  particles: Particle[],
): Particle[] => {
  if (particles.length < 2) return particles
  return map(particles, particle => {
    const neighbor = findNearestNeighbor(particle, particles)
    return {
      ...particle,
      neighbors: [neighbor],
    }
  })
}

export const findNearestNeighbor = (
  particle: Particle,
  particles: Particle[],
): Neighbor => {
  let minDistance: number = Infinity
  let minIndex: number = -1
  each(particles, (other, index) => {
    if (particle === other) return
    const distance = getDistance(particle.position, other.position)
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
