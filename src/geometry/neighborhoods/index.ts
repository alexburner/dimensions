import { nearest, NearestConfig } from 'src/geometry/neighborhoods/nearest'
import { Particle } from 'src/geometry/particles'

export type Neighborhood<Config> = (
  particles: Particle[],
  config: Config,
) => Particle[]

export type NeighborhoodNames = 'nearest'

export type NeighborhoodConfigs = NearestConfig

export interface NeighborhoodSpec {
  name: NeighborhoodNames
  config: NeighborhoodConfigs
}

export const neighborhoods: {
  [name in NeighborhoodNames]: Neighborhood<NeighborhoodConfigs>
} = {
  nearest,
}

/**
 * TODO: simulations for these deprecated types
 */

export type ForceRuleName = 'flock' | 'diffusion' | 'gravity' | 'wander'

export interface ForceRule {
  name: ForceRuleName
  maxSpeed: number
  maxForce: number
}

export interface FlockForceRule extends ForceRule {
  name: 'flock'
  awareness: number
  separation: number
  alignment: number
  cohesion: number
}

export interface DiffusionForceRule extends ForceRule {
  name: 'diffusion'
  charge: number
}

export interface GravityForceRule extends ForceRule {
  name: 'gravity'
  mass: number
}

export interface WanderForceRule extends ForceRule {
  name: 'wander'
  jitter: number
}
