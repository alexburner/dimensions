import { map } from 'lodash'

import { Particle } from 'src/geometry/particles'
import { SharedConfig, Simulation } from 'src/geometry/simulations'
import { random } from 'src/util'

export interface Config extends SharedConfig {
  jitter: number
}

export interface Spec {
  name: 'wandering'
  config: Config
}

export const wandering: Simulation<Config> = (
  particles: Particle[],
  config: Config,
): Particle[] =>
  // Generate random accelerations
  map(particles, particle => ({
    ...particle,
    acceleration: map(particle.acceleration, () => random(config.jitter)),
  }))
