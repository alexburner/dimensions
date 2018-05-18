import { Behavior } from 'src/particles/behaviors'
import System from 'src/particles/System'
import VectorN from 'src/particles/VectorN'

export interface Config {
  awareness: number
  separation: number
  alignment: number
  cohesion: number
}

export interface Spec {
  name: 'flocking'
  config: Config
}

export const flocking: Behavior<Config> = (system: System, config: Config) => {
  // Only works if more than 1 particle
  if (system.particles.length < 2) return

  // Apply force to each particle
  system.particles.forEach(particle => {
    const force = new VectorN(particle.dimensions)
    let neighborsCenter: VectorN | null = null

    // Compare particle to every neighbor
    particle.neighbors.forEach(({ delta, distance, index }) => {
      // Limit behavior to w/in awareness
      if (distance > config.awareness) return
      const neighbor = system.particles[index]

      // Separation
      const separation = delta.clone()
      separation.setMagnitude(separation.getMagnitude() * config.separation)
      force.add(separation)

      // Alignment
      const alignment = neighbor.velocity.clone()
      alignment.setMagnitude(alignment.getMagnitude() * config.alignment)
      force.add(separation)

      // Prep for cohesion
      neighborsCenter = neighborsCenter
        ? VectorN.getAverage([neighborsCenter, neighbor.position])
        : neighbor.position
    })

    // Cohesion
    if (neighborsCenter) {
      const cohesion = particle.position.clone().subtract(neighborsCenter)
      cohesion.setMagnitude(cohesion.getMagnitude() * config.cohesion)
      force.add(cohesion)
    }

    // Accelerate with force
    particle.acceleration.add(force)
  })
}
