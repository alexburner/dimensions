import * as THREE from 'three'

import { FIELD_SIZE } from 'src/constants'
import VectorN from 'src/geometry/VectorN'

/**
 * Annotation for neighbors within particles array
 */
export interface Neighbor {
  distance: number
  index: number
}

/**
 * Particle using VectorN
 */
export class ParticleN {
  public dimensions: number
  public position: VectorN
  public velocity: VectorN
  public acceleration: VectorN
  public neighbors: Neighbor[]

  constructor(dimensions: number) {
    this.dimensions = dimensions
    this.position = new VectorN(dimensions)
    this.velocity = new VectorN(dimensions)
    this.acceleration = new VectorN(dimensions)
    this.neighbors = []
  }

  public randomize(k: number = 1): ParticleN {
    this.position.randomize(k)
    this.velocity.randomize(k)
    this.acceleration.randomize(k)
    return this
  }

  public backfill(other: ParticleN): ParticleN {
    this.position.mutate((v, i) => other.position.value(i) || v)
    this.velocity.mutate((v, i) => other.velocity.value(i) || v)
    this.acceleration.mutate((v, i) => other.acceleration.value(i) || v)
    return this
  }
}

/**
 * Particle for exchanging between worker & render threads
 */
export class ParticleMsg {
  public dimensions: number
  public position: Float32Array
  public velocity: Float32Array
  public acceleration: Float32Array
  public neighbors: Neighbor[]

  constructor({
    dimensions,
    position,
    velocity,
    acceleration,
    neighbors,
  }: ParticleN) {
    this.dimensions = dimensions
    this.position = position.toArray()
    this.velocity = velocity.toArray()
    this.acceleration = acceleration.toArray()
    this.neighbors = neighbors
  }
}

/**
 * Particle using THREE.Vector3
 */
export class Particle3 {
  public dimensions: number
  public position: THREE.Vector3
  public velocity: THREE.Vector3
  public acceleration: THREE.Vector3
  public neighbors: Neighbor[]

  constructor({
    dimensions,
    position,
    velocity,
    acceleration,
    neighbors,
  }: ParticleMsg) {
    this.dimensions = dimensions
    this.position = toVector3(position)
    this.velocity = toVector3(velocity)
    this.acceleration = toVector3(acceleration)
    this.neighbors = neighbors
  }
}

/**
 * Convert VectorN to THREE.Vector3
 */
const toVector3 = (v: Float32Array): THREE.Vector3 => {
  const x = v[0] || 0
  const y = v[1] || 0
  const z = v[2] || 0
  return new THREE.Vector3(x, y, z)
}

/**
 * Make new particles, optionally using values from old particles
 */
export const makeParticles = (
  dimensions: number,
  particles: number,
  prev: ParticleN[] = [],
): ParticleN[] =>
  new Array(particles).fill(undefined).map((_, i): ParticleN => {
    const particle = new ParticleN(dimensions).randomize(FIELD_SIZE / 2)
    if (prev[i]) particle.backfill(prev[i])
    return particle
  })
