import { map, reduce } from 'lodash'

import { FIELD_SIZE } from 'src/constants'
import { Bounding } from 'src/geometry/boundings'
import { Particle } from 'src/geometry/particles'
import { average, getLengthSq, math } from 'src/geometry/vector-n'

const RADIUS = FIELD_SIZE / 2
const LIMIT = RADIUS * RADIUS // XXX to avoid Math.sqrt()

export const scaling: Bounding = (particles: Particle[]): Particle[] => {
  // Only works for 2 or more particles
  if (particles.length < 2) return particles

  // Find geometric center of particles (by averaging their positions)
  const centroid = average(map(particles, particle => particle.position))

  // Find longest radius between individual & center
  const positions = map(particles, particle => particle.position)
  const maxRadius = reduce(
    positions,
    (memo, position) => {
      const delta = math.sub(position, centroid)
      const length = getLengthSq(delta)
      return Math.max(length, memo)
    },
    -Infinity,
  )

  // Abort if already within limits
  if (maxRadius <= LIMIT) return particles

  // Scale down all particles
  const factor = LIMIT / maxRadius
  return map(particles, particle => ({
    ...particle,
    position: math.mul(particle.position, factor),
  }))
}
