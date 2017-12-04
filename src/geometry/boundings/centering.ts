import { map } from 'lodash'

import { Bounding } from 'src/geometry/boundings'
import { Particle } from 'src/geometry/particles'
import { average, math } from 'src/geometry/vector-n'

export const centering: Bounding = (particles: Particle[]): Particle[] => {
  if (particles.length === 0) return []

  // Find geometric center of particles (by averaging their locations)
  const centroid = average(map(particles, particle => particle.location))

  // Shift each particle over (assuming origin is zero)
  return map(particles, particle => ({
    ...particle,
    location: math.sub(particle.location, centroid),
  }))
}
