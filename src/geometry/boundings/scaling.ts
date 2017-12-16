import { FIELD_SIZE } from 'src/constants'
import { Bounding } from 'src/geometry/boundings'
import { Particle } from 'src/geometry/particles'
import VectorN from 'src/geometry/VectorN'

const RADIUS = FIELD_SIZE / 2
const LIMIT = RADIUS * RADIUS // XXX to avoid Math.sqrt()

export const scaling: Bounding = (particles: Particle[]): Particle[] => {
  // Only works for 2 or more particles
  if (particles.length < 2) return particles

  // Find geometric center of particles (by averaging their positions)
  const positions = particles.map(particle => particle.position)
  const centroid = VectorN.getAverage(positions)

  // Find longest radius between individual & center
  const maxRadius = positions.reduce((memo, position) => {
    const radius = VectorN.getDistanceSq(position, centroid)
    return Math.max(radius, memo)
  }, -Infinity)

  // Abort if already within limits
  if (maxRadius <= LIMIT) return particles

  // Scale down all particles
  const factor = LIMIT / maxRadius
  particles.forEach(particle => particle.position.multiply(factor))

  // TODO update types to reflect mutation-over-creation?
  return particles
}
