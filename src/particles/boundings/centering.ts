import { Bounding } from 'src/particles/boundings'
import System from 'src/particles/System'
import VectorN from 'src/particles/VectorN'

export const centering: Bounding = (system: System) => {
  // Subtract centroid vector from each particle's position
  // (effectively shifting the centroid to origin zero)
  const positions = system.particles.map(p => p.position)
  const centroid = VectorN.getAverage(positions)
  system.particles.forEach(p => p.position.subtract(centroid))
}
