import { MAX_RADIUS } from 'src/constants'
import { Bounding } from 'src/particles/boundings'
import ParticleN from 'src/particles/ParticleN'
import System from 'src/particles/System'

const MAX_MAGNITUDE_SQ = MAX_RADIUS * MAX_RADIUS // XXX avoids Math.sqrt()

export const centerScaling: Bounding = (system: System): void => {
  // Only works for 1 or more particles
  if (system.particles.length < 1) return

  // Find longest distance between individual particle & origin
  const largestMagnitudeSq = system.particles.reduce(
    (memo: number, particle: ParticleN) =>
      Math.max(memo, particle.position.getMagnitudeSq()),
    -1,
  )

  // Abort if already within limits
  if (largestMagnitudeSq <= MAX_MAGNITUDE_SQ) return

  // Scale down all particles
  const factor = MAX_MAGNITUDE_SQ / largestMagnitudeSq
  system.particles.forEach((p: ParticleN) => p.position.multiply(factor))
}
