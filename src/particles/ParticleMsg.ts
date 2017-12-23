import ParticleN from 'src/particles/ParticleN'

/**
 * Particle for exchanging between worker & render threads
 */
export default class ParticleMsg {
  public dimensions: number
  public position: Float32Array
  public velocity: Float32Array
  public acceleration: Float32Array

  constructor({ dimensions, position, velocity, acceleration }: ParticleN) {
    this.dimensions = dimensions
    this.position = position.toArray()
    this.velocity = velocity.toArray()
    this.acceleration = acceleration.toArray()
  }
}
