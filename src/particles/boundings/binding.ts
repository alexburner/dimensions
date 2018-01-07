import { MAX_RADIUS } from 'src/constants'
import { Bounding } from 'src/particles/boundings'
import System from 'src/particles/System'

export const binding: Bounding = (system: System) => {
  // Scale all particles to be exact radius from center
  system.particles.forEach(p => p.position.setMagnitude(MAX_RADIUS))
}
