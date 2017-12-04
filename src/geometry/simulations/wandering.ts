import { map } from 'lodash'

import { Particle } from 'src/geometry/particles'
import { SharedConfig, Simulation } from 'src/geometry/simulations'
import { math } from 'src/geometry/vector-n'
import { random } from 'src/util'

export interface WanderingConfig {
  jitter: number
}

export const wandering: Simulation<SharedConfig & WanderingConfig> = (
  particles: Particle[],
  config: WanderingConfig,
): Particle[] => {
  // Generate random accelerations
  particles = map(particles, particle => ({
    ...particle,
    acceleration: map(particle.acceleration, () => random(config.jitter)),
  }))

  // Add accelerations to velocities
  particles = map(particles, particle => ({
    ...particle,
    velocity: math.add(particle.velocity, particle.acceleration),
  }))

  // Add velocities to positions
  particles = map(particles, particle => ({
    ...particle,
    position: math.add(particle.position, particle.velocity),
  }))

  return particles
}
