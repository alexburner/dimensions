import { Particle } from 'src/geometry/particles'
import { wandering, WanderingConfig } from 'src/geometry/simulations/wandering'

export interface SharedConfig {
  maxSpeed: number
  maxForce: number
}

export type Simulation<Config> = (
  particles: Particle[],
  config: Config,
) => Particle[]

export type SimulationNames = 'wandering'

export type SimulationConfigs = SharedConfig & (WanderingConfig)

export interface SimulationSpec {
  name: SimulationNames
  config: SimulationConfigs
}

export const simulations: {
  [name in SimulationNames]: Simulation<SimulationConfigs>
} = {
  wandering,
}
