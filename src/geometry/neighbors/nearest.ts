import { each } from 'lodash'

import { getDistanceSq } from 'src/geometry/vector-n'
import { Particle } from 'src/interfaces'

export default (particles: Particle[]) => {
  each(particles, (particleA, indexA) => {
    // walk through each particle, find nearest other
    let minDistance: number = Infinity
    let minIndex: number = indexA
    each(particles, (particleB, indexB) => {
      if (indexA === indexB) return
      const distance = getDistanceSq(particleA.location, particleB.location)
      if (distance < minDistance) {
        minDistance = distance
        minIndex = indexB
      }
    })
    // store nearest neighbor index
    particleA.neighborIndices = [minIndex]
  })
}
