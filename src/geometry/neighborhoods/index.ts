import {
  nearest,
  Spec as NearestSpec,
} from 'src/geometry/neighborhoods/nearest'
import { Particle } from 'src/geometry/particles'

export type Neighborhood<Config> = (
  particles: Particle[],
  config: Config,
) => Particle[]

export type NeighborhoodSpecs = NearestSpec

export const neighborhoods: {
  [name in NeighborhoodSpecs['name']]: Neighborhood<any>
} = {
  nearest,
}
