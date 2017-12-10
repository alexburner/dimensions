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
