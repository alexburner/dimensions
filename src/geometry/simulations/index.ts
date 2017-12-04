import { Particle } from 'src/geometry/particles'
import {
  Spec as WanderingSpec,
  wandering,
} from 'src/geometry/simulations/wandering'
import {
  Spec as Wandering2Spec,
  wandering2,
} from 'src/geometry/simulations/wandering2'

export interface SharedConfig {
  maxSpeed: number
  maxForce: number
}

export type Simulation<Config> = (
  particles: Particle[],
  config: Config,
) => Particle[]

export type SimulationSpecs = WanderingSpec | Wandering2Spec

export const simulations: {
  [name in SimulationSpecs['name']]: Simulation<any>
} = {
  wandering,
  wandering2,
}

/**
 *
 * TODO: simulations for these deprecated types
 *
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
