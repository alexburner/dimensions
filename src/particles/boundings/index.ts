import { binding } from 'src/particles/boundings/binding'
import { centering } from 'src/particles/boundings/centering'
import { scaling } from 'src/particles/boundings/scaling'
import { wrapping } from 'src/particles/boundings/wrapping'
import ParticleN from 'src/particles/ParticleN'

export type Bounding = (particles: ParticleN[]) => void

export type BoundingName = 'centering' | 'scaling' | 'binding' | 'wrapping'

export const boundings: { [name in BoundingName]: Bounding } = {
  centering,
  scaling,
  binding,
  wrapping,
}

export const boundingNames = Object.keys(boundings) as BoundingName[]
