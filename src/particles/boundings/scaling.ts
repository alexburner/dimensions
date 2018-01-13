import { MAX_RADIUS } from 'src/constants'
import { Bounding } from 'src/particles/boundings'
import System from 'src/particles/System'
import VectorN from 'src/particles/VectorN'

const LIMIT = MAX_RADIUS * MAX_RADIUS // XXX to avoid Math.sqrt()

export const scaling: Bounding = (system: System) => {
  // Only works for 2 or more particles
  if (system.particles.length < 2) return

  // Find longest radius between individual & center
  const positions = system.particles.map(p => p.position)
  const longestRadius = positions.reduce((memo, position) => {
    const radius = VectorN.getDistanceSq(position, system.centroid)
    return Math.max(memo, radius)
  }, -1)

  // Abort if already within limits
  if (longestRadius <= LIMIT + 1) return

  // Scale down all particles
  const factor = LIMIT / longestRadius
  system.particles.forEach(p => p.position.multiply(factor))
}
