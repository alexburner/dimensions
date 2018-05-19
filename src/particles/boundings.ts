import { binding } from 'src/particles/boundings/binding'
import { centering } from 'src/particles/boundings/centering'
import { centerScaling } from 'src/particles/boundings/centerScaling'
import { none } from 'src/particles/boundings/none'
import { scaling } from 'src/particles/boundings/scaling'
import { wrapping } from 'src/particles/boundings/wrapping'
import System from 'src/particles/System'

export type Bounding = (system: System) => void

export type BoundingName =
  | 'centering'
  | 'scaling'
  | 'centerScaling'
  | 'binding'
  | 'wrapping'
  | 'none'

export const boundings: { [name in BoundingName]: Bounding } = {
  centering,
  scaling,
  centerScaling,
  binding,
  wrapping,
  none,
}
