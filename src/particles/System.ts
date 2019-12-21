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
 * Neighbor for worker/browser transport
 */
export interface NeighborMsg {
  index: number
  delta: Float32Array
  distance: number
}

type NeighborhoodType = 'all' | 'locals' | 'nearest' | 'proximity'

/**
 * Neighbor objects, sorted nearest -> furthest
 */
export interface NeighborhoodMsg {
  type: NeighborhoodType
  /**
   * NeighborMsg[] for each particle
   */
  neighbors: NeighborMsg[][]
}

interface NeighborhoodSpec {
  name: NeighborhoodType
  config?: any // TODO - what do here
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
        return {
          type: 'all',
          neighbors: this.particles.map((particle: ParticleN) =>
            particle.neighbors.map((neighbor: NeighborN) =>
              toNeighborMsg(neighbor),
            ),
          ),
        }
      case 'locals':
        return {
          type: 'locals',
          neighbors: this.particles.map((particle: ParticleN) =>
            particle.neighbors
              .slice(0, particle.dimensions)
              .map((neighbor: NeighborN) => toNeighborMsg(neighbor)),
          ),
        }
      case 'nearest':
        return {
          type: 'nearest',
          neighbors: this.particles.map((particle: ParticleN) =>
            particle.neighbors
              .slice(0, 1)
              .map((neighbor: NeighborN) => toNeighborMsg(neighbor)),
          ),
        }
      case 'proximity':
        return {
          type: 'proximity',
          neighbors: this.particles.map((particle: ParticleN) => {
            const neighbors: NeighborN[] = []
            for (let i = 0, l = particle.neighbors.length; i < l; i++) {
              const neighbor = particle.neighbors[i]
              if (neighbor.distance < spec.config.min) continue
              if (neighbor.distance > spec.config.max) break
              neighbors.push(neighbor)
            }
            return neighbors.map((neighbor: NeighborN) =>
              toNeighborMsg(neighbor),
            )
          }),
        }
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
