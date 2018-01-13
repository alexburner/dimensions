import { MAX_RADIUS } from 'src/constants'
import { Bounding } from 'src/particles/boundings'
import System from 'src/particles/System'

const MAX_MAGNITUDE_SQ = MAX_RADIUS * MAX_RADIUS // XXX avoids Math.sqrt()

export const centerScaling: Bounding = (system: System) => {
  // Only works for 2 or more particles
  if (system.particles.length < 2) return

  // Find longest distance between individual particle & origin
  const largestMagnitudeSq = system.particles.reduce((memo, particle) => {
    return Math.max(memo, particle.position.getMagnitudeSq())
  }, -1)

  // Abort if already within limits
  if (largestMagnitudeSq <= MAX_MAGNITUDE_SQ) return

  // Scale down all particles
  const factor = MAX_MAGNITUDE_SQ / largestMagnitudeSq
  system.particles.forEach(p => p.position.multiply(factor))
}
