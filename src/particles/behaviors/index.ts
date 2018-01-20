import {
  diffusion,
  Spec as DiffusionSpec,
} from 'src/particles/behaviors/diffusion'
import { gravity, Spec as GravitySpec } from 'src/particles/behaviors/gravity'
import { none, Spec as NoneSpec } from 'src/particles/behaviors/none'
import {
  Spec as WanderingSpec,
  wandering,
} from 'src/particles/behaviors/wandering'
import System from 'src/particles/System'

export type Behavior<Config> = (system: System, config: Config) => void

export type BehaviorSpecs =
  | WanderingSpec
  | DiffusionSpec
  | GravitySpec
  | NoneSpec

export const behaviors: { [name in BehaviorSpecs['name']]: Behavior<any> } = {
  wandering,
  diffusion,
  gravity,
  none,
}
