import { findNearestNeighbor } from 'src/geometry/neighborhoods/nearest'
import { Particle } from 'src/geometry/particles'
import { SharedConfig, Simulation } from 'src/geometry/simulations'
import VectorN from 'src/geometry/VectorN'

export interface Config extends SharedConfig {
  charge: number
}

export interface Spec {
  name: 'diffusion'
  config: Config
}

export const diffusion: Simulation<Config> = (
  particles: Particle[],
  config: Config,
): Particle[] => {
  // Only works if more than 1 particle
  if (particles.length < 2) return particles

  // Compare each particle to every other particle
  particles.forEach(particle => {
    // Find nearest neighbor
    const neighbor = findNearestNeighbor(particle, particles)
    const other = particles[neighbor.index]

    // Find delta vector from that neighbor's postions to here
    const delta = VectorN.subtract(particle.position, other.position)

    // TODO should probably limit force here?
    // using config.charge value? or something?

    // Accelerate particle toward other
    particle.acceleration.add(delta)
  })

  // TODO update types to reflect mutation-over-creation?
  return particles
}
