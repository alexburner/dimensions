import { NeighborN } from 'src/particles/System'
import VectorN from 'src/particles/VectorN'

/**
 * Particle using VectorN
 */
export default class ParticleN {
  public dimensions: number
  public position: VectorN
  public velocity: VectorN
  public acceleration: VectorN
  public neighbors: NeighborN[]

  constructor(dimensions: number) {
    this.dimensions = dimensions
    this.position = new VectorN(dimensions)
    this.velocity = new VectorN(dimensions)
    this.acceleration = new VectorN(dimensions)
    this.neighbors = []
  }

  /**
   * Randomize particle quality values
   * @param  {number = 1}           k limits (-k, k)
   * @return {ParticleN}   self for chaining
   */
  public randomize(k: number = 1): ParticleN {
    this.position.radialRandomize(k)
    this.velocity.radialRandomize(k)
    this.acceleration.radialRandomize(k)
    return this
  }

  /**
   * Fill this particle with another particle's values (for aligned dimensions)
   * @param  {ParticleN} other other particle to copy values
   * @return {ParticleN}       self for chaining
   */
  public fill(other: ParticleN): ParticleN {
    // Value falls back to self, if outside other's dimensions
    this.position.mutate(
      (v: number, i: number) => other.position.getValue(i) || v,
    )
    this.velocity.mutate(
      (v: number, i: number) => other.velocity.getValue(i) || v,
    )
    this.acceleration.mutate(
      (v: number, i: number) => other.acceleration.getValue(i) || v,
    )
    return this
  }
}
