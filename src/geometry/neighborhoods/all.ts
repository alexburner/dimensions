import { map, reduce } from 'lodash'

import { Neighborhood } from 'src/geometry/neighborhoods'
import { Neighbor, Particle } from 'src/geometry/particles'
import { getDistance } from 'src/geometry/vector-n'

interface Config {}

export interface Spec {
  name: 'all'
  config: Config
}

export const all: Neighborhood<Config> = (
  particles: Particle[],
): Particle[] => {
  return map(particles, particle => ({
    ...particle,
    neighbors: reduce(
      particles,
      (memo, other, index) => {
        if (particle === other) return memo
        const distance = getDistance(particle.position, other.position)
        memo.push({ index, distance })
        return memo
      },
      [] as Neighbor[],
    ),
  }))
}
