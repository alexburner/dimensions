import { Bounding } from 'src/particles/boundings'
import System from 'src/particles/System'

export const centering: Bounding = (system: System) => {
  // Subtract centroid vector from each particle's position
  // (effectively shifting the centroid to origin zero)
  system.particles.forEach(p => p.position.subtract(system.centroid))
}
