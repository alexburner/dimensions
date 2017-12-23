import * as THREE from 'three'

import ParticleMsg from 'src/particles/ParticleMsg'

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
 * Particle using THREE.Vector3
 */
export default class Particle3 {
  public dimensions: number
  public position: THREE.Vector3
  public velocity: THREE.Vector3
  public acceleration: THREE.Vector3

  constructor({ dimensions, position, velocity, acceleration }: ParticleMsg) {
    this.dimensions = dimensions
    this.position = toVector3(position)
    this.velocity = toVector3(velocity)
    this.acceleration = toVector3(acceleration)
  }
}
