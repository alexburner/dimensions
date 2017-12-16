import { FIELD_SIZE } from 'src/constants'
import { Bounding } from 'src/geometry/boundings'
import { ParticleN } from 'src/geometry/particles'

const RADIUS = FIELD_SIZE / 2

export const binding: Bounding = (particles: ParticleN[]) => {
  // Scale all particles to be exact radius from center
  particles.forEach(particle => particle.position.setLength(RADIUS))
}
