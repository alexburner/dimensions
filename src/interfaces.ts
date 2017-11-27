import { VectorN } from 'src/geometry/vector-n'

export interface Particle {
  location: VectorN
  velocity: VectorN
  acceleration: VectorN
  neighborIndices: number[]
}

export interface RenderParticle {
  location: THREE.Vector3
  velocity: THREE.Vector3
  acceleration: THREE.Vector3
  neighborIndices: number[]
}

export type ForceName = 'flock' | 'diffusion' | 'gravity' | 'wander'
export type NeighborName = 'all' | 'nearest' | 'minimum' | 'proximity'
export type LayerName = 'points' | 'lines' | 'circles' | 'spheres'
export type LayerDict = { [name in LayerName]: boolean }

export interface Force {
  name: ForceName
  maxSpeed: number
  maxForce: number
}

export interface FlockForce extends Force {
  name: 'flock'
  awareness: number
  separation: number
  alignment: number
  cohesion: number
}

export interface DiffusionForce extends Force {
  name: 'diffusion'
  charge: number
}

export interface GravityForce extends Force {
  name: 'gravity'
  mass: number
}

export interface WanderForce extends Force {
  name: 'wander'
  jitter: number
}

export interface Neighbor {
  name: NeighborName
}


export interface AllNeightbor extends Neighbor {
  name: 'all'
}

export interface NearestNeighbor extends Neighbor {
  name: 'nearest'
}

export interface MinimumNeigbor extends Neighbor {
  name: 'minimum'
}

export interface ProximityNeigbor extends Neighbor {
  name: 'proximity'
  min: number
  max: number
}

export type ForceUnion =
  | FlockForce
  | DiffusionForce
  | GravityForce
  | WanderForce

export type NeighborUnion =
  | AllNeightbor
  | NearestNeighbor
  | MinimumNeigbor
  | ProximityNeigbor

export interface WorkerRequest {
  dimensions: number
  particles: number
  force: ForceUnion
  neighbor: NeighborUnion
  layers: LayerDict
}

export interface WorkerResponse {
  particles: Particle[]
  layers: LayerDict
}
