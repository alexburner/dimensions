import { Particle } from 'src/geometry/particles'

export type ForceRuleName = 'flock' | 'diffusion' | 'gravity' | 'wander'
export type NeighborRuleName = 'all' | 'nearest' | 'minimum' | 'proximity'
export type LayerName = 'points' | 'lines' | 'circles' | 'spheres'
export type LayerDict = { [name in LayerName]: boolean }

export interface ForceRule {
  name: ForceRuleName
  maxSpeed: number
  maxForce: number
}

export interface FlockForceRule extends ForceRule {
  name: 'flock'
  awareness: number
  separation: number
  alignment: number
  cohesion: number
}

export interface DiffusionForceRule extends ForceRule {
  name: 'diffusion'
  charge: number
}

export interface GravityForceRule extends ForceRule {
  name: 'gravity'
  mass: number
}

export interface WanderForceRule extends ForceRule {
  name: 'wander'
  jitter: number
}

export interface NeighborRule {
  name: NeighborRuleName
}

export interface AllNeightbor extends NeighborRule {
  name: 'all'
}

export interface NearestNeighborRule extends NeighborRule {
  name: 'nearest'
}

export interface MinimumNeigbor extends NeighborRule {
  name: 'minimum'
}

export interface ProximityNeigbor extends NeighborRule {
  name: 'proximity'
  min: number
  max: number
}

export type ForceRules =
  | FlockForceRule
  | DiffusionForceRule
  | GravityForceRule
  | WanderForceRule

export type NeighborRules =
  | AllNeightbor
  | NearestNeighborRule
  | MinimumNeigbor
  | ProximityNeigbor

export interface WorkerRequest {
  dimensions: number
  particles: number
  force: ForceRules
  neighbor: NeighborRules
  layers: LayerDict
}

export interface WorkerResponse {
  particles: Particle[]
  layers: LayerDict
}
