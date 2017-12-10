import { each, map } from 'lodash'

import { Neighborhood } from 'src/geometry/neighborhoods'
import { nearest } from 'src/geometry/neighborhoods/nearest'
import { Particle } from 'src/geometry/particles'
import { getDistance } from 'src/geometry/vector-n'

interface Config {}

export interface Spec {
  name: 'nextNearest'
  config: Config
}

export const nextNearest: Neighborhood<Config> = (
  particles: Particle[],
): Particle[] => {
  if (particles.length < 2) return particles
  if (particles.length === 2) return nearest(particles)
  const isConnected: { [key: string]: boolean } = {}
  return map(particles, (particleA, indexA) => {
    let minDistance: number = Infinity
    let minIndex: number = -1
    each(particles, (particleB, indexB) => {
      if (particleA === particleB) return
      if (isConnected[`${indexB},${indexA}`]) return
      const distance = getDistance(particleA.position, particleB.position)
      if (distance < minDistance) {
        minDistance = distance
        minIndex = indexB
      }
    })
    isConnected[`${indexA},${minIndex}`] = true
    return {
      ...particleA,
      neighbors: [
        {
          distance: minDistance,
          index: minIndex,
        },
      ],
    }
  })
}
