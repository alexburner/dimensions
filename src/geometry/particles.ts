import { times } from 'lodash'

import * as vectorN from 'src/geometry/vector-n'
import { Particle } from 'src/interfaces'

/**
 * Make new particles, optionally using old particles
 * (expanding/contracting old particle count & dimesionality as needed)
 */
export const makeParticles = (
  dimensionCount: number,
  particleCount: number,
  prevParticles: Particle[] = [],
): Particle[] => times(
  particleCount,
  i => prevParticles[i]
    ? makeParticleFromPrev(dimensionCount, prevParticles[i])
    : makeParticle(dimensionCount),
)

/**
 * Make a new particle from a previous particle
 * (expanding/contracting dimensionality as needed)
 * (expansions seeded with random 0-1 values)
 */
export const makeParticleFromPrev = (
  dimensions: number,
  prev: Particle,
): Particle => ({
  location: times(dimensions, i => prev.location[i] || Math.random()),
  velocity: times(dimensions, i => prev.velocity[i] || Math.random()),
  acceleration: times(dimensions, i => prev.acceleration[i] || Math.random()),
  neighbors: [],
})

/**
 * Make a new particle (seeded with random 0-1 values)
 */
export const makeParticle = (
  dimensions: number,
): Particle => ({
  location: vectorN.makeRandom(dimensions),
  velocity: vectorN.makeRandom(dimensions),
  acceleration: vectorN.makeRandom(dimensions),
  neighbors: [],
})
