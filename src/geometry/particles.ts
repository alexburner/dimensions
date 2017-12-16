import * as THREE from 'three'

import VectorN from 'src/geometry/VectorN'

export interface Neighbor {
  index: number
  distance: number
}

export interface Particle {
  position: VectorN
  velocity: VectorN
  acceleration: VectorN
  neighbors: Neighbor[]
}

export interface Particle3 {
  position: THREE.Vector3
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
  new Array(particles)
    .fill(undefined)
    .map(
      (_, i) =>
        prev[i]
          ? makeParticleFromPrev(dimensions, fieldSize / 2, prev[i])
          : makeParticle(dimensions, fieldSize / 2),
    )

/**
 * Make a new particle from a previous particle
 * (filling missing dimensions with random (-k, k) values)
 */
export const makeParticleFromPrev = (
  d: number,
  k: number,
  prev: Particle,
): Particle => {
  // Create fresh new particle
  const next = makeParticle(d, k)
  // Backfill particle with previous values, if available
  next.position.mutate((v, i) => prev.position.values[i] || v)
  next.velocity.mutate((v, i) => prev.velocity.values[i] || v)
  next.acceleration.mutate((v, i) => prev.acceleration.values[i] || v)
  return next
}

/**
 * Make a new particle (seeded with random (-k, k) values)
 */
export const makeParticle = (d: number, k: number): Particle => ({
  position: new VectorN(d).randomize(k),
  velocity: new VectorN(d).randomize(k),
  acceleration: new VectorN(d).randomize(k),
  neighbors: [],
})

/**
 * Convert a VectorN particle to a Vector3 particle
 */
export const toParticle3 = (p: Particle): Particle3 => ({
  position: toVector3(p.position),
  velocity: toVector3(p.velocity),
  acceleration: toVector3(p.acceleration),
  neighbors: p.neighbors,
})

const toVector3 = (v: VectorN): THREE.Vector3 =>
  new THREE.Vector3(v.values[0] || 0, v.values[1] || 0, v.values[2] || 0)
