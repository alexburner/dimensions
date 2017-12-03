import { each } from 'lodash'

import { Particle } from 'src/geometry/particles'
import { getDistance } from 'src/geometry/vector-n'

export default (particles: Particle[]) => {
  each(particles, (particleA, indexA) => {
    // Walk through each other particle
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
    // Store nearest neighbor
    particleA.neighbors = [
      {
        distance: minDistance,
        index: minIndex,
      },
    ]
  })
}
