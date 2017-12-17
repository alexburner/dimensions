import { FIELD_SIZE } from 'src/constants'
import { Bounding } from 'src/geometry/boundings'
import { ParticleN } from 'src/geometry/particles'
import VectorN from 'src/geometry/VectorN'

const RADIUS = FIELD_SIZE / 2
const RADIUS_SQ = RADIUS * RADIUS

export const scaling: Bounding = (particles: ParticleN[]) => {
  // Only works for 2 or more particles
  if (particles.length < 2) return particles

  // Find geometric center of particles (by averaging their positions)
  const positions = particles.map(particle => particle.position)
  const centroid = VectorN.getAverage(positions)

  // Find longest radius between individual & center
  const maxRadiusSq = positions.reduce((memo, position) => {
    const radiusSq = VectorN.getDistanceSq(position, centroid)
    return Math.max(radiusSq, memo)
  }, -Infinity)

  // Abort if already within limits
  if (maxRadiusSq <= RADIUS_SQ) return particles

  // Scale down all particles
  const factor = RADIUS_SQ / maxRadiusSq
  particles.forEach(particle => {
    particle.position.multiply(factor)
    // TODO SO CLOSE
    //
    // something about the way the forces accumulate on the acceleration
    // are turning this scaling into a black hole of death
    // const ideal = VectorN.multiply(particle.position, factor)
    // const delta = VectorN.subtract(ideal, particle.position)
    // particle.acceleration.add(delta)
    //
    // possible clue:
    // the relative positions are frozen initially
    // (no "behavior" motion is apparent)
    // while the bounding forces apply
  })
}
