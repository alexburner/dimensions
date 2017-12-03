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
