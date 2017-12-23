import { Neighborhood } from 'src/particles/neighborhoods'
import ParticleN from 'src/particles/ParticleN'
import { Neighbor } from 'src/particles/System'
import VectorN from 'src/particles/VectorN'

interface Config {}

export interface Spec {
  name: 'all'
  config: Config
}

export const all: Neighborhood<Config> = (particles: ParticleN[]) => {
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
}
