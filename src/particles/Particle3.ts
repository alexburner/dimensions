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

  constructor(msg?: ParticleMsg) {
    if (msg) {
      this.dimensions = msg.dimensions
      this.position = toVector3(msg.position)
      this.velocity = toVector3(msg.velocity)
      this.acceleration = toVector3(msg.acceleration)
    } else {
      this.dimensions = 0
      this.position = new THREE.Vector3()
      this.velocity = new THREE.Vector3()
      this.acceleration = new THREE.Vector3()
    }
  }

  public clone(): Particle3 {
    const clone = new Particle3()
    clone.dimensions = this.dimensions
    clone.position = this.position.clone()
    clone.velocity = this.velocity.clone()
    clone.acceleration = this.acceleration.clone()
    return clone
  }
}

/**
 * Convert VectorMsg to THREE.Vector3
 */
export const toVector3 = (vectorMsg: Float32Array): THREE.Vector3 => {
  const x = vectorMsg[0] || 0
  const y = vectorMsg[1] || 0
  const z = vectorMsg[2] || 0
  return new THREE.Vector3(x, y, z)
}
