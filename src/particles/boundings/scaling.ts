import { MAX_RADIUS } from 'src/constants'
import { Bounding } from 'src/particles/boundings'
import System from 'src/particles/System'
import VectorN from 'src/particles/VectorN'

const MAX_DISTANCE_SQ = MAX_RADIUS * MAX_RADIUS // XXX avoids Math.sqrt()

export const scaling: Bounding = (system: System) => {
  // Only works for 2 or more particles
  if (system.particles.length < 2) return

  // Find longest distance between individual particle & system centroid
  const positions = system.particles.map(p => p.position)
  const centroid = VectorN.getAverage(positions)
  const longestDistanceSq = positions.reduce((memo, position) => {
    const delta = position.clone().subtract(centroid)
    const distanceSq = delta.getMagnitudeSq()
    return Math.max(memo, distanceSq)
  }, -1)

  // Abort if already within limits
  if (longestDistanceSq <= MAX_DISTANCE_SQ) return

  // Scale down all particles
  const factor = MAX_DISTANCE_SQ / longestDistanceSq
  system.particles.forEach(p => p.position.multiply(factor))
}
