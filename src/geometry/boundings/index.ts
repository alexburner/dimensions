import { binding } from 'src/geometry/boundings/binding'
import { centering } from 'src/geometry/boundings/centering'
import { scaling } from 'src/geometry/boundings/scaling'
import { wrapping } from 'src/geometry/boundings/wrapping'
import { ParticleN } from 'src/geometry/particles'

export type Bounding = (particles: ParticleN[]) => void

export type BoundingName = 'centering' | 'scaling' | 'binding' | 'wrapping'

export const boundings: { [name in BoundingName]: Bounding } = {
  centering,
  scaling,
  binding,
  wrapping,
}

export const boundingNames = Object.keys(boundings) as BoundingName[]
