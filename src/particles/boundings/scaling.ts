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
    const distanceSq = VectorN.getDistanceSq(position, centroid)
    return Math.max(memo, distanceSq)
  }, -1)

  // Abort if already within limits
  if (longestDistanceSq <= MAX_DISTANCE_SQ) return

  // Scale down all particles
  const factor = MAX_DISTANCE_SQ / longestDistanceSq
  system.particles.forEach(p => p.position.multiply(factor))
}

/**
 * TODO choices
 *   - scale furthest distance between two particles
 *   - scale furthest distance between particle & centroid
 *   - scale furthest distance between particle & origin
 *
 * current = centroid
 *   theoretically, with centering, should be nonvolatile
 *   BUT, when random particle added, centroid shifts to match
 *   which changes centering
 *   which changes furthest from centroid (?)
 *
 *   oooo or because
 *   re-centering can push some beyond bounds?
 *   hm wait does that make sense
 *   but the scaling is to centroid
 *   the new random particle means new centroid?
 *   and new furthest value
 *   and new scaline needed
 *   but if the centroid === the origin (post-centering)
 *   and the new particle is positioned radially
 *   shouldn't it be within the furthest possible distance?
 *   and not trigger additional scaling
 *
 *   HM BUT
 *   scaling & centering should be decoupled
 *   both operate on the centroid of the system
 *   regardless of where it is currently located
 *   right?
 *
 * could do = origin
 *   this would make for smooth radial random placements
 *   but would no longer allow decoupling centering & scaling
 */
