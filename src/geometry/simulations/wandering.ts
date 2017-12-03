import { map } from 'lodash'

import { Particle } from 'src/geometry/particles'
import { SharedConfig, Simulation } from 'src/geometry/simulations'
import { math } from 'src/geometry/vector-n'
import { random } from 'src/util'

export interface WanderingConfig {}

export const wandering: Simulation<SharedConfig & WanderingConfig> = (
  particles: Particle[],
  _config: WanderingConfig,
): Particle[] => {
  // 1. clear accelerations
  // 2. accumulate accelerations
  // 3. apply accelerations

  return map(particles, particle => ({
    ...particle,
    location: math.add(particle.location, random()),
  }))
}
