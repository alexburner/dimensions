import {
  diffusion,
  Spec as DiffusionSpec,
} from 'src/particles/behaviors/diffusion'
import {
  Spec as WanderingSpec,
  wandering,
} from 'src/particles/behaviors/wandering'
import System from 'src/particles/System'

export type Behavior<Config> = (system: System, config: Config) => void

export type BehaviorSpecs = WanderingSpec | DiffusionSpec

export const behaviors: { [name in BehaviorSpecs['name']]: Behavior<any> } = {
  wandering,
  diffusion,
}
