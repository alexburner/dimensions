import { centering } from 'src/geometry/boundings/centering'
import { scaling } from 'src/geometry/boundings/scaling'
import { wrapping } from 'src/geometry/boundings/wrapping'
import { ParticleN } from 'src/geometry/particles'

export type Bounding = (particles: ParticleN[]) => void
export type BoundingName = 'wrapping' | 'centering' | 'scaling'
export type BoundingEnabled = { [name in BoundingName]: boolean }

export const boundings: { [name in BoundingName]: Bounding } = {
  wrapping,
  centering,
  scaling,
}

export const boundingNames = Object.keys(boundings) as BoundingName[]
