import * as THREE from 'three'

import ParticleMsg from 'src/particles/ParticleMsg'

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

/**
 * Convert VectorMsg to THREE.Vector3
 */
const toVector3 = (vectorMsg: Float32Array): THREE.Vector3 => {
  const x = vectorMsg[0] || 0
  const y = vectorMsg[1] || 0
  const z = vectorMsg[2] || 0
  return new THREE.Vector3(x, y, z)
}
