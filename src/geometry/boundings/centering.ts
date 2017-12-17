import { Bounding } from 'src/geometry/boundings'
import { ParticleN } from 'src/geometry/particles'
import VectorN from 'src/geometry/VectorN'

export const centering: Bounding = (particles: ParticleN[]) => {
  if (particles.length === 0) return []

  // Find geometric center of particles (by averaging their positions)
  const positions = particles.map(particle => particle.position)
  const centroid = VectorN.getAverage(positions)

  // Subtract centroid vector from each particle's position
  // (effectively shifting the centroid to origin zero)
  particles.forEach(particle => particle.position.subtract(centroid))
}
