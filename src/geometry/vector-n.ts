import { isNumber, map, reduce, times } from 'lodash'

import { random } from 'src/util'

/**
 * Allows for n dimensions, by using lists to hold scalars
 *  Vector2 { x, y }     ->  VectorN [ x, y ]
 *  Vector3 { x, y, z }  ->  VectorN [ x, y, z ]
 */
export type VectorN = number[]

/**
 * VectorN "math" module
 *
 * Supports basic algebra methods:
 * > const vectorC = math.add(vectorA, vectorB)
 * > const vectorC = math.sub(vectorA, vectorB)
 * > const vectorC = math.mul(vectorA, vectorB)
 * > const vectorC = math.div(vectorA, vectorB)
 *
 * Supports scalars as second argument:
 * > const vectorC = math.add(vectorA, 10)
 * > const vectorC = math.sub(vectorA, 10)
 * > const vectorC = math.mul(vectorA, 10)
 * > const vectorC = math.div(vectorA, 10)
 */

type NumberMath = (a: number, b: number) => number
type VectorMath = (a: VectorN, b: VectorN | number) => VectorN

const merge = (a: VectorN, b: VectorN, action: NumberMath): VectorN =>
  times(a.length, i => action(a[i], b[i]))

const mathThunk = (action: NumberMath): VectorMath => (a, b): VectorN => {
  if (isNumber(b)) b = makeNew(a.length, b)
  return merge(a, b, action)
}

export const math = {
  add: mathThunk((n1, n2) => n1 + n2),
  sub: mathThunk((n1, n2) => n1 - n2),
  mul: mathThunk((n1, n2) => n1 * n2),
  div: mathThunk((n1, n2) => n1 / n2),
}

/**
 * Make a new vector, optionally pre-populated with a scalar
 */
export const makeNew = (dimensions: number, n: number = 0): VectorN =>
  times(dimensions, () => n)

/**
 * Make a new vector, pre-populated with random numbers
 */
export const makeRandom = (dimensions: number, k: number = 1): VectorN =>
  times(dimensions, () => random(k))

/**
 * Get the squared length of a vector
 */
export const getLengthSq = (v: VectorN): number =>
  reduce(v, (memo: number, n: number) => memo + n * n, 0)

/**
 * Get the length of a vector
 */
export const getLength = (v: VectorN): number => Math.sqrt(getLengthSq(v))

/**
 * Get the squared distance between two vectors
 */
export const getDistanceSq = (a: VectorN, b: VectorN): number => {
  const delta = math.sub(a, b)
  return getLengthSq(delta)
}

/**
 * Get the distance between two vectors
 */
export const getDistance = (a: VectorN, b: VectorN): number =>
  Math.sqrt(getDistanceSq(a, b))

/**
 * Set the length of a vector
 */
export const setLength = (v: VectorN, length: number): VectorN =>
  math.mul(v, length / getLength(v))

/**
 * Set a vector's length to 1
 */
export const normalize = (v: VectorN): VectorN => setLength(v, 1)

/**
 * Find the average of a list of vectors
 */
export const average = (vectors: VectorN[]): VectorN => {
  if (vectors.length === 0) throw new Error('Cannot average zero vectors')
  const dimensions = vectors[0].length
  const count = vectors.length
  return reduce(
    vectors,
    (memo, vector) => map(vector, (n, i) => memo[i] + n / count),
    makeNew(dimensions, 0),
  )
}
