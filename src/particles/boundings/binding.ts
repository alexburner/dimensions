import { FIELD_SIZE } from 'src/constants'
import { Bounding } from 'src/particles/boundings'
import ParticleN from 'src/particles/ParticleN'

const RADIUS = FIELD_SIZE / 2

export const binding: Bounding = (particles: ParticleN[]) => {
  // Scale all particles to be exact radius from center
  particles.forEach(particle => particle.position.setMagnitude(RADIUS))
}
