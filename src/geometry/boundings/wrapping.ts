import { map } from 'lodash'

import { FIELD_SIZE } from 'src/constants'
import { Bounding } from 'src/geometry/boundings'
import { Particle } from 'src/geometry/particles'

/**
 * XXX: wraps line/square/cube for simplicity
 * (instead of line/circle/sphere)
 */

const LIMIT = FIELD_SIZE / 2

const wrap = (n: number): number => {
  if (n < -LIMIT) return LIMIT
  if (n > LIMIT) return -LIMIT
  return n
}

export const wrapping: Bounding = (particles: Particle[]): Particle[] =>
  map(particles, particle => ({
    ...particle,
    position: map(particle.position, wrap),
  }))
