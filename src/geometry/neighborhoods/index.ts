import { all, Spec as AllSpec } from 'src/geometry/neighborhoods/all'
import {
  nearest,
  Spec as NearestSpec,
} from 'src/geometry/neighborhoods/nearest'
import { ParticleN } from 'src/geometry/particles'

export type Neighborhood<Config> = (
  particles: ParticleN[],
  config?: Config,
) => void

export type NeighborhoodSpecs = AllSpec | NearestSpec

export const neighborhoods: {
  [name in NeighborhoodSpecs['name']]: Neighborhood<any>
} = {
  all,
  nearest,
}
