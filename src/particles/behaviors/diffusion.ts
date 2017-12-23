import { Behavior } from 'src/particles/behaviors'
import { findNearestNeighbor } from 'src/particles/neighborhoods/nearest'
import ParticleN from 'src/particles/ParticleN'
import VectorN from 'src/particles/VectorN'

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
    const distance = neighbor.distance

    // Find delta vector from that neighbor's postions to here
    const delta = VectorN.subtract(particle.position, other.position)

    // Set force magnitude with inverse square law
    delta.setMagnitude(config.charge * config.charge / (distance * distance))

    // Accelerate particle toward other
    particle.acceleration.add(delta)
  })
}
