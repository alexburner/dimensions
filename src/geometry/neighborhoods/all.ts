import { Neighborhood } from 'src/geometry/neighborhoods'
import { Neighbor, Particle } from 'src/geometry/particles'
import VectorN from 'src/geometry/VectorN'

interface Config {}

export interface Spec {
  name: 'all'
  config: Config
}

export const all: Neighborhood<Config> = (
  particles: Particle[],
): Particle[] => {
  particles.forEach(
    particle =>
      (particle.neighbors = particles.reduce(
        (memo, other, index) => {
          if (particle === other) return memo
          const distance = VectorN.getDistance(
            particle.position,
            other.position,
          )
          memo.push({ index, distance })
          return memo
        },
        [] as Neighbor[],
      )),
  )

  // TODO update types to reflect mutation-over-creation?
  return particles
}
