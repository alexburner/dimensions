import {
  diffusion,
  Spec as DiffusionSpec,
} from 'src/particles/behaviors/diffusion'
import {
  diffusionX,
  Spec as DiffusionXSpec,
} from 'src/particles/behaviors/diffusionX'
import {
  Spec as WanderingSpec,
  wandering,
} from 'src/particles/behaviors/wandering'
import System from 'src/particles/System'

export type Behavior<Config> = (system: System, config: Config) => void

export type BehaviorSpecs = WanderingSpec | DiffusionSpec | DiffusionXSpec

export const behaviors: { [name in BehaviorSpecs['name']]: Behavior<any> } = {
  wandering,
  diffusion,
  diffusionX,
}
