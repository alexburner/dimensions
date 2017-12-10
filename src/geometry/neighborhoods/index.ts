import { all, Spec as AllSpec } from 'src/geometry/neighborhoods/all'
import {
  nearest,
  Spec as NearestSpec,
} from 'src/geometry/neighborhoods/nearest'
import {
  nextNearest,
  Spec as NextNearestSpec,
} from 'src/geometry/neighborhoods/nextNearest'
import { Particle } from 'src/geometry/particles'

export type Neighborhood<Config> = (
  particles: Particle[],
  config?: Config,
) => Particle[]

export type NeighborhoodSpecs = AllSpec | NearestSpec | NextNearestSpec

export const neighborhoods: {
  [name in NeighborhoodSpecs['name']]: Neighborhood<any>
} = {
  all,
  nearest,
  nextNearest,
}
