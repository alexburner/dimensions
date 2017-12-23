import { FIELD_SIZE } from 'src/constants'
import { Bounding } from 'src/particles/boundings'
import System from 'src/particles/System'

const RADIUS = FIELD_SIZE / 2

export const binding: Bounding = (system: System) => {
  // Scale all particles to be exact radius from center
  system.particles.forEach(p => p.position.setMagnitude(RADIUS))
}
