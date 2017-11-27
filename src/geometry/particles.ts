import { times } from 'lodash'

import * as vectorN from 'src/geometry/vector-n'
import { Particle } from 'src/interfaces'

/**
 * Make new particles, optionally using old particles
 * (expanding/contracting old particle count & dimesionality as needed)
 */
export const makeParticles = (
  dimensions: number,
  particles: number,
  prev: Particle[] = [],
): Particle[] =>
  times(
    particles,
    i =>
      prev[i]
        ? makeParticleFromPrev(dimensions, prev[i])
        : makeParticle(dimensions),
  )

/**
 * Make a new particle (seeded with random 0-1 values)
 */
export const makeParticle = (d: number): Particle => ({
  location: vectorN.makeRandom(d),
  velocity: vectorN.makeRandom(d),
  acceleration: vectorN.makeRandom(d),
  neighborIndices: [],
})

/**
 * Make a new particle from a previous particle
 * (expanding/contracting dimensionality as needed)
 * (expansions seeded with random 0-1 values)
 */
export const makeParticleFromPrev = (d: number, prev: Particle): Particle => {
  const next = makeParticle(d)
  return {
    location: times(d, i => prev.location[i] || next.location[i]),
    velocity: times(d, i => prev.velocity[i] || next.velocity[i]),
    acceleration: times(d, i => prev.acceleration[i] || next.acceleration[i]),
    neighborIndices: [],
  }
}
