import { BehaviorSpecs } from 'src/particles/behaviors'
import { BoundingName } from 'src/particles/boundings'
import ParticleMsg from 'src/particles/ParticleMsg'
import { NeighborhoodMsg, NeighborhoodSpecs } from 'src/particles/System'
import { LayerName } from 'src/view/Layers'

export interface RenderOptions {
  layers: { [name in LayerName]: boolean }
}

export interface WorkerOptions {
  dimensions: number
  particles: number
  max: {
    force: number
    speed: number
  }
  behavior: BehaviorSpecs
  neighborhood: NeighborhoodSpecs
  bounding: BoundingName
}

export type Options = RenderOptions & WorkerOptions

// TODO seems like this should live in worker.ts
// but also nice to have it next to WorkerOptions
// as an input/output kinda thing... I dunno
export interface WorkerResponse {
  dimensions: number
  particles: ParticleMsg[]
  neighborhood: NeighborhoodMsg
}
