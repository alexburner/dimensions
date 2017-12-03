import { times } from 'lodash'
import * as THREE from 'three'

import { makeRandom, VectorN } from 'src/geometry/vector-n'

export interface Neighbor {
  index: number
  distance: number
}

export interface Particle {
  location: VectorN
  velocity: VectorN
  acceleration: VectorN
  neighbors: Neighbor[]
}

export interface Particle3 {
  location: THREE.Vector3
  velocity: THREE.Vector3
  acceleration: THREE.Vector3
  neighbors: Neighbor[]
}

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
  location: makeRandom(d, k),
  velocity: makeRandom(d, k),
  acceleration: makeRandom(d, k),
  neighbors: [],
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
    neighbors: [],
  }
}

/**
 * Convert a VectorN particle to a Vector3 particle
 */
export const toParticle3 = (p: Particle): Particle3 => ({
  location: toVector3(p.location),
  velocity: toVector3(p.velocity),
  acceleration: toVector3(p.acceleration),
  neighbors: p.neighbors,
})

const toVector3 = (v: VectorN): THREE.Vector3 =>
  new THREE.Vector3(v[0] || 0, v[1] || 0, v[2] || 0)
