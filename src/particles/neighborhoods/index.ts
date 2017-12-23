import { all, Spec as AllSpec } from 'src/particles/neighborhoods/all'
import { locals, Spec as LocalsSpec } from 'src/particles/neighborhoods/locals'
import {
  nearest,
  Spec as NearestSpec,
} from 'src/particles/neighborhoods/nearest'
import ParticleN from 'src/particles/ParticleN'

export type Neighborhood<Config> = (
  particles: ParticleN[],
  config?: Config,
) => void

export type NeighborhoodSpecs = AllSpec | LocalsSpec | NearestSpec

export const neighborhoods: {
  [name in NeighborhoodSpecs['name']]: Neighborhood<any>
} = {
  all,
  locals,
  nearest,
}
