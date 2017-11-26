import { VectorN } from 'src/geometry/vector-n'

export interface Particle {
  location: VectorN
  velocity: VectorN
  acceleration: VectorN
  neighbors: Particle[]
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

export interface ProximityNeigbor {
  name: 'proximity'
  min: number
  max: number
}

export interface WorkerRequest {
  dimensionCount: number
  particleCount: number
  force: Force
  neighbor: Neighbor
  layerDict: LayerDict
}

export interface WorkerResponse {
  particles: Particle[]
  layerDict: LayerDict
}
