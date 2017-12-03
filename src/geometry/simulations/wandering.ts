import { each, map } from 'lodash'

import { random } from 'src/util'
import { Particle } from 'src/geometry/particles'
import { math } from 'src/geometry/vector-n'

export default (particles: Particle[]): Particle[] => {
  return map(particles, (particle) => ({
    ...particle,
    location: math.add(particle.location, random())
  }))
}
