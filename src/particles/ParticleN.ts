import { Neighbor } from 'src/particles/System'
import VectorN from 'src/particles/VectorN'

/**
 * Particle using VectorN
 */
export default class ParticleN {
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
