import { Behavior } from 'src/geometry/behaviors'
import { findNearestNeighbor } from 'src/geometry/neighborhoods/nearest'
import { ParticleN } from 'src/geometry/particles'
import VectorN from 'src/geometry/VectorN'

export interface Config {
  charge: number
}

export interface Spec {
  name: 'diffusion'
  config: Config
}

export const diffusion: Behavior<Config> = (
  particles: ParticleN[],
  config: Config,
) => {
  // Only works if more than 1 particle
  if (particles.length < 2) return particles

  // Compare each particle to every other particle
  particles.forEach(particle => {
    // Find nearest neighbor
    const neighbor = findNearestNeighbor(particle, particles)
    const other = particles[neighbor.index]

    // Find delta vector from that neighbor's postions to here
    const delta = VectorN.subtract(particle.position, other.position)

    // Limit force with "charge"
    delta.multiply(config.charge)

    // Accelerate particle toward other
    particle.acceleration.add(delta)
  })
}
