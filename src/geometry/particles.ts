import { times } from 'lodash'

import * as vectorN from 'src/geometry/vector-n'
import { Particle } from 'src/interfaces'

/**
 * Make new particles, optionally using old particles
 * (expanding/contracting old particle count & dimesionality as needed)
 */
export const makeParticles = (
  fieldSize: number,
  dimensions: number,
  particles: number,
  prev: Particle[] = [],
): Particle[] =>
  times(
    particles,
    i =>
      prev[i]
        ? makeParticleFromPrev(dimensions, fieldSize, prev[i])
        : makeParticle(dimensions, fieldSize),
  )

/**
 * Make a new particle (seeded with random 0-1 values)
 */
export const makeParticle = (d: number, k: number): Particle => ({
  location: vectorN.makeRandom(d, k),
  velocity: vectorN.makeRandom(d, k),
  acceleration: vectorN.makeRandom(d, k),
  neighborIndices: [],
})

/**
 * Make a new particle from a previous particle
 * (expanding/contracting dimensionality as needed)
 * (expansions seeded with random 0-1 values)
 */
export const makeParticleFromPrev = (
  d: number,
  k: number,
  prev: Particle,
): Particle => {
  const next = makeParticle(d, k)
  return {
    location: times(d, i => prev.location[i] || next.location[i]),
    velocity: times(d, i => prev.velocity[i] || next.velocity[i]),
    acceleration: times(d, i => prev.acceleration[i] || next.acceleration[i]),
    neighborIndices: [],
  }
}
