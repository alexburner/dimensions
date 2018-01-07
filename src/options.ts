import { LayerName } from 'src/drawing/layers'
import { BehaviorSpecs } from 'src/particles/behaviors'
import { BoundingName } from 'src/particles/boundings'
import { Neighborhood, NeighborhoodSpecs } from 'src/particles/neighborhoods'
import ParticleMsg from 'src/particles/ParticleMsg'

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
  boundings: { [name in BoundingName]: boolean }
}

export type Options = RenderOptions & WorkerOptions

// TODO seems like this should live in worker.ts
// but also nice to have it next to WorkerOptions
// as an input/output kinda thing... I dunno
export interface WorkerResponse {
  dimensions: number
  particles: ParticleMsg[]
  neighborhood: Neighborhood
}
