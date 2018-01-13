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
  public centroid: VectorN // average of all particle positions
  public furthest: number // largest distance between two particles

  constructor() {
    this.particles = []
    this.centroid = new VectorN(0)
    this.furthest = 0
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
   * Recaculate centroid, furthest distance, and particle neighbors
   * (must be run after applying forces to particle positions)
   */
  public recalculate() {
    // Find geometric center of particles (by averaging their positions)
    this.centroid = VectorN.getAverage(this.particles.map(p => p.position))

    // Find relationships between all particle positions
    // and update furthest distance within system
    this.furthest = -1
    this.particles.forEach(particle => {
      particle.neighbors = []
      this.particles.forEach((other, index) => {
        if (particle === other) return
        const delta = VectorN.subtract(particle.position, other.position)
        const distance = delta.getMagnitude()
        this.furthest = Math.max(this.furthest, distance)
        particle.neighbors.push({ index, delta, distance })
      })

      // Sort each particle's neighbors by nearest -> furthest
      particle.neighbors.sort((a, b) => a.distance - b.distance)
    })
  }
}
