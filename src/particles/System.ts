import { MAX_RADIUS } from 'src/constants'
import ParticleN from 'src/particles/ParticleN'
import VectorN from 'src/particles/VectorN'

/**
 * Annotation of one particle's relationship to another
 */
export interface NeighborN {
  index: number
  delta: VectorN
  distance: number
}

/**
 * Neighborhood for worker/browser transport
 */
export interface NeighborMsg {
  index: number
  delta: Float32Array
  distance: number
}

export type NeighborhoodMsg = NeighborMsg[][]

interface NeighborhoodSpec {
  name: string
  config?: { [prop: string]: any }
}

interface AllSpec extends NeighborhoodSpec {
  name: 'all'
}

interface LocalSpec extends NeighborhoodSpec {
  name: 'locals'
}

interface NearestSpec extends NeighborhoodSpec {
  name: 'nearest'
}

interface ProximitySpec extends NeighborhoodSpec {
  name: 'proximity'
  config: {
    min: number
    max: number
  }
}

export type NeighborhoodSpecs =
  | AllSpec
  | LocalSpec
  | NearestSpec
  | ProximitySpec

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
  public setPopulation(count: number, dimensions: number): void {
    const oldParticles = this.particles
    const newParticles = new Array(count)
      .fill(undefined)
      .map((_: undefined, i: number) => {
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
  public recalculate(): void {
    // Find relationships between all particle positions
    this.particles.forEach((particle: ParticleN) => {
      particle.neighbors = []
      this.particles.forEach((other: ParticleN, index: number) => {
        if (particle === other) return
        const delta = particle.position.clone().subtract(other.position)
        const distance = delta.getMagnitude()
        particle.neighbors.push({ index, delta, distance })
      })

      // Sort each particle's neighbors by nearest -> furthest
      particle.neighbors.sort(
        (a: NeighborN, b: NeighborN) => a.distance - b.distance,
      )
    })
  }

  /**
   * Extract a neighborhood structure based on a provided spec
   */
  public getNeighborhoodMsg(spec: NeighborhoodSpecs): NeighborhoodMsg {
    switch (spec.name) {
      case 'all':
        return this.particles.map((particle: ParticleN) =>
          particle.neighbors.map((neighbor: NeighborN) =>
            toNeighborMsg(neighbor),
          ),
        )
      case 'locals':
        return this.particles.map((particle: ParticleN) =>
          particle.neighbors
            .slice(0, particle.dimensions)
            .map((neighbor: NeighborN) => toNeighborMsg(neighbor)),
        )
      case 'nearest':
        return this.particles.map((particle: ParticleN) =>
          particle.neighbors
            .slice(0, 1)
            .map((neighbor: NeighborN) => toNeighborMsg(neighbor)),
        )
      case 'proximity':
        throw new Error('TODO: proximity neighborhood')
    }
  }
}

/**
 * Convert a NeighborN to NeighborMsg
 */
const toNeighborMsg = (n: NeighborN): NeighborMsg => ({
  index: n.index,
  delta: n.delta.toArray(),
  distance: n.distance,
})
