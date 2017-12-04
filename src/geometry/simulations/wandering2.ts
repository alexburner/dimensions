/**
 *
 * XXX TODO TEMP
 * just here to proof out multiple specs
 *
 */

import { map } from 'lodash'

import { Particle } from 'src/geometry/particles'
import { SharedConfig, Simulation } from 'src/geometry/simulations'
import { math } from 'src/geometry/vector-n'
import { random } from 'src/util'

interface Config extends SharedConfig {
  jitter2: number
}

export interface Spec {
  name: 'wandering2'
  config: Config
}

export const wandering2: Simulation<Config> = (
  particles: Particle[],
  config: Config,
): Particle[] => {
  // Generate random accelerations
  particles = map(particles, particle => ({
    ...particle,
    acceleration: map(particle.acceleration, () => random(config.jitter2)),
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
