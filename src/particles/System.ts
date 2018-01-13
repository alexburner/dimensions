import { MAX_RADIUS } from 'src/constants'
import ParticleN from 'src/particles/ParticleN'
import VectorN from 'src/particles/VectorN'

/**
 * Annotation of one particle's relationship to another
 */
export interface Neighbor {
  index: number
  delta: VectorN
  distance: number
}

/**
 * A system of ParticleN objects
 */
export default class System {
  public particles: ParticleN[]

  constructor() {
    this.particles = []
  }

  /**
   * Update particle count & dimensions
   * (attempts to preserve any existing particle data)
   */
  public setPopulation(count: number, dimensions: number) {
    const oldParticles = this.particles
    const newParticles = new Array(count).fill(null).map((_, i): ParticleN => {
      const newParticle = new ParticleN(dimensions)
      oldParticles[i]
        ? newParticle.fill(oldParticles[i])
        : newParticle.randomize(MAX_RADIUS)
      return newParticle
    })
    this.particles = newParticles
    this.recalculate()
  }

  /**
   * Recaculate particle neighbors
   * (must be run after applying forces to particle positions)
   */
  public recalculate() {
    // Find relationships between all particle positions
    this.particles.forEach(particle => {
      particle.neighbors = []
      this.particles.forEach((other, index) => {
        if (particle === other) return
        const delta = VectorN.subtract(particle.position, other.position)
        const distance = delta.getMagnitude()
        particle.neighbors.push({ index, delta, distance })
      })

      // Sort each particle's neighbors by nearest -> furthest
      particle.neighbors.sort((a, b) => a.distance - b.distance)
    })
  }
}
