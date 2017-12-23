import { FIELD_SIZE } from 'src/constants'
import { Bounding } from 'src/particles/boundings'
import System from 'src/particles/System'

/**
 * XXX: wraps line/square/cube for simplicity
 * (instead of line/circle/sphere)
 *
 * TODO: radial wrapping
 */

const LIMIT = FIELD_SIZE / 2

const wrap = (n: number): number => {
  if (n < -LIMIT) return LIMIT
  if (n > LIMIT) return -LIMIT
  return n
}

export const wrapping: Bounding = (system: System) => {
  system.particles.forEach(p => p.position.mutate(wrap))
}
