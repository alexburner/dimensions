import { FIELD_SIZE } from 'src/constants'
import { Bounding } from 'src/geometry/boundings'
import { ParticleN } from 'src/geometry/particles'
import VectorN from 'src/geometry/VectorN'

const RADIUS = FIELD_SIZE / 2

export const binding: Bounding = (particles: ParticleN[]) => {
  // Scale all particles to be exact radius from center
  particles.forEach(particle => {
    const ideal = VectorN.clone(particle.position).setLength(RADIUS)
    const delta = VectorN.subtract(ideal, particle.position)
    particle.acceleration.add(delta)
  })
}
