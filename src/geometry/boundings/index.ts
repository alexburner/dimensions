import { centering } from 'src/geometry/boundings/centering'
import { scaling } from 'src/geometry/boundings/scaling'
import { wrapping } from 'src/geometry/boundings/wrapping'
import { Particle } from 'src/geometry/particles'

export type Bounding = (particles: Particle[]) => Particle[]
export type BoundingNames = 'wrapping' | 'centering' | 'scaling'
export type BoundingEnabled = { [name in BoundingNames]: boolean }

// XXX: used to preserve order of execution
export const boundingNameList: BoundingNames[] = [
  'wrapping',
  'centering',
  'scaling',
]

export const boundings: { [name in BoundingNames]: Bounding } = {
  wrapping,
  centering,
  scaling,
}
