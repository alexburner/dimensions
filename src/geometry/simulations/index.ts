import { Particle } from 'src/geometry/particles'
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
  particles: Particle[],
  config: Config,
) => Particle[]

export type SimulationSpecs = WanderingSpec | DiffusionSpec

export const simulations: {
  [name in SimulationSpecs['name']]: Simulation<any>
} = {
  wandering,
  diffusion,
}
