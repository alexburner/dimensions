import {
  diffusion,
  Spec as DiffusionSpec,
} from 'src/geometry/behaviors/diffusion'
import {
  Spec as WanderingSpec,
  wandering,
} from 'src/geometry/behaviors/wandering'
import { ParticleN } from 'src/geometry/particles'

export interface SharedConfig {
  maxSpeed: number
  maxForce: number
}

export type Behavior<Config> = (particles: ParticleN[], config: Config) => void

export type BehaviorSpecs = WanderingSpec | DiffusionSpec

export const behaviors: { [name in BehaviorSpecs['name']]: Behavior<any> } = {
  wandering,
  diffusion,
}
