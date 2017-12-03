import { each, map } from 'lodash'

import { Particle } from 'src/geometry/particles'
import { getDistance } from 'src/geometry/vector-n'

export default (particles: Particle[]): Particle[] => {
  return map(particles, (particleA, indexA) => {
    let minDistance: number = Infinity
    let minIndex: number = indexA
    each(particles, (particleB, indexB) => {
      if (indexA === indexB) return
      const distance = getDistance(particleA.location, particleB.location)
      if (distance < minDistance) {
        minDistance = distance
        minIndex = indexB
      }
    })
    return {
      ...particleA,
      neighbors: [{ index: minIndex, distance: minDistance }],
    }
  })
}
