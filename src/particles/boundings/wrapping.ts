import { FIELD_SIZE } from 'src/constants'
import { Bounding } from 'src/particles/boundings'
import ParticleN from 'src/particles/ParticleN'

/**
 * XXX: wraps line/square/cube for simplicity
 * (instead of line/circle/sphere)
 *
 * TODO: radiual wrapping
 */

const LIMIT = FIELD_SIZE / 2

const wrap = (n: number): number => {
  if (n < -LIMIT) return LIMIT
  if (n > LIMIT) return -LIMIT
  return n
}

export const wrapping: Bounding = (particles: ParticleN[]) => {
  particles.forEach(particle => particle.position.mutate(wrap))
}
