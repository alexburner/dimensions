import { each, map } from 'lodash'

import { Neighborhood } from 'src/geometry/neighborhoods'
import { Particle } from 'src/geometry/particles'
import { getDistance } from 'src/geometry/vector-n'

interface Config {}

export interface Spec {
  name: 'nearest'
  config: Config
}

export const nearest: Neighborhood<Config> = (
  particles: Particle[],
  _config: Config,
): Particle[] => {
  return map(particles, (particleA, indexA) => {
    let minDistance: number = Infinity
    let minIndex: number = indexA
    each(particles, (particleB, indexB) => {
      if (indexA === indexB) return
      const distance = getDistance(particleA.position, particleB.position)
      if (distance < minDistance) {
        minDistance = distance
        minIndex = indexB
      }
    })
    return {
      ...particleA,
      neighbors: [{ index: minIndex, distance: minDistance }],
    }
  })
}
