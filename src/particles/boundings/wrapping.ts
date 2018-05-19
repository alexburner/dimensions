import { MAX_RADIUS } from 'src/constants'
import { Bounding } from 'src/particles/boundings'
import ParticleN from 'src/particles/ParticleN'
import System from 'src/particles/System'

/**
 * XXX: wraps line/square/cube for simplicity
 * (instead of line/circle/sphere)
 *
 * TODO: radial wrapping
 */

const wrap = (n: number): number => {
  if (n < -MAX_RADIUS) return MAX_RADIUS
  if (n > MAX_RADIUS) return -MAX_RADIUS
  return n
}

export const wrapping: Bounding = (system: System): void => {
  system.particles.forEach((p: ParticleN) => p.position.mutate(wrap))
}
