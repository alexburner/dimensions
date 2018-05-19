import { MAX_RADIUS } from 'src/constants'
import { Bounding } from 'src/particles/boundings'
import ParticleN from 'src/particles/ParticleN'
import System from 'src/particles/System'

export const binding: Bounding = (system: System): void => {
  // Scale all particles to be exact radius from center
  system.particles.forEach((p: ParticleN) =>
    p.position.setMagnitude(MAX_RADIUS),
  )
}
