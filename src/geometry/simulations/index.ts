import { ParticleN } from 'src/geometry/particles'
import {
  diffusion,
  Spec as DiffusionSpec,
} from 'src/geometry/simulations/diffusion'
import {
  Spec as WanderingSpec,
  wandering,
} from 'src/geometry/simulations/wandering'

export interface SharedConfig {
  maxSpeed: number
  maxForce: number
}

export type Simulation<Config> = (
  particles: ParticleN[],
  config: Config,
) => ParticleN[]

export type SimulationSpecs = WanderingSpec | DiffusionSpec

export const simulations: {
  [name in SimulationSpecs['name']]: Simulation<any>
} = {
  wandering,
  diffusion,
}
