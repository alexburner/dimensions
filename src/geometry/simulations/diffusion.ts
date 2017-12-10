import { map } from 'lodash'

import { findNearestNeighbor } from 'src/geometry/neighborhoods/nearest'
import { Particle } from 'src/geometry/particles'
import { SharedConfig, Simulation } from 'src/geometry/simulations'
import { math } from 'src/geometry/vector-n'

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
  return map(particles, particle => {
    // Find nearest neighbor
    const neighbor = findNearestNeighbor(particle, particles)
    const other = particles[neighbor.index]

    // Find delta vector from that neighbor's postions to here
    const delta = math.sub(particle.position, other.position)

    // TODO should probably limit force here?
    // using config.charge value? or something?

    // Accelerate particle toward other
    const acceleration = math.add(particle.acceleration, delta)

    return {
      ...particle,
      acceleration,
    }
  })
}
