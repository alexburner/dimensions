import {
  diffusion,
  Spec as DiffusionSpec,
} from 'src/particles/behaviors/diffusion'
import {
  flocking,
  Spec as FlockingSpec,
} from 'src/particles/behaviors/flocking'
import { gravity, Spec as GravitySpec } from 'src/particles/behaviors/gravity'
import { none, Spec as NoneSpec } from 'src/particles/behaviors/none'
import { orbits, Spec as OrbitsSpec } from 'src/particles/behaviors/orbits'
import {
  Spec as WanderingSpec,
  wandering,
} from 'src/particles/behaviors/wandering'
import System from 'src/particles/System'

export type Behavior<Config> = (system: System, config: Config) => void

export type BehaviorSpecs =
  | WanderingSpec
  | DiffusionSpec
  | FlockingSpec
  | GravitySpec
  | OrbitsSpec
  | NoneSpec

export const behaviors: { [name in BehaviorSpecs['name']]: Behavior<any> } = {
  wandering,
  diffusion,
  flocking,
  gravity,
  orbits,
  none,
}
