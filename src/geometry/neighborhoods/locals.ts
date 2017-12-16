import { Neighborhood } from 'src/geometry/neighborhoods'
import { Neighbor, ParticleN } from 'src/geometry/particles'
import VectorN from 'src/geometry/VectorN'

interface Config {}

export interface Spec {
  name: 'locals'
  config: Config
}

export const locals: Neighborhood<Config> = (particles: ParticleN[]) => {
  particles.forEach(particle => {
    const neighbors = particles.reduce(
      (memo, other, index) => {
        if (particle === other) return memo
        const distance = VectorN.getDistance(particle.position, other.position)
        memo.push({ index, distance })
        return memo
      },
      [] as Neighbor[],
    )
    neighbors.sort((a, b) => a.distance - b.distance)
    particle.neighbors = neighbors.slice(0, particle.position.values.length)
  })
}
