import { isNumber, reduce, times } from 'lodash'

/**
 * Supports n dimensions, by using lists to hold scalars
 *  Vector2 { x, y }     ->  VectorN [ x, y ]
 *  Vector3 { x, y, z }  ->  VectorN [ x, y, z ]
 */
export type VectorN = number[]

/**
 * Make a new vector, optionally pre-populated with a constant
 */
export const make = (dimensions: number, n: number = 0): VectorN =>
  times(dimensions, () => n)

/**
 * Make a new vector, pre-populated with random numbers
 */
export const makeRandom = (dimensions: number, k: number = 1): VectorN =>
  times(dimensions, () => Math.random() * k)

/**
 * Get the length of a vector (more expensive)
 */
export const getLength = (v: VectorN): number => Math.sqrt(getLengthSq(v))

/**
 * Get the squared length of a vector (cheaper)
 */
export const getLengthSq = (v: VectorN): number =>
  reduce(v, (memo: number, n: number) => memo + n * n, 0)

/**
 * Set the length of a vector
 */
export const setLength = (v: VectorN, length: number): VectorN =>
  math.multiply(v, length / getLength(v))

/**
 * Set a vector's length to 1
 */
export const normalize = (v: VectorN): VectorN => setLength(v, 1)

/**
 * Add basic algebra methods, such as:
 * > const vectorC = math.add(vectorA, vectorB)
 *
 * Also support math with constants, such as:
 * > const vectorC = math.multiply(vectorA, 10)
 * by converting the second argument into a vector of itself, if needed
 */

type Action = (a: number, b: number) => number

export const merge = (a: VectorN, b: VectorN, action: Action): VectorN =>
  times(a.length, i => action(a[i], b[i]))

const makeMath = (action: Action) => (
  a: VectorN,
  b: VectorN | number,
): VectorN => {
  if (isNumber(b)) b = make(a.length, b)
  return merge(a, b, action)
}

export const math = {
  add: makeMath((n1: number, n2: number): number => n1 + n2),
  subtract: makeMath((n1: number, n2: number): number => n1 - n2),
  multiply: makeMath((n1: number, n2: number): number => n1 * n2),
  divide: makeMath((n1: number, n2: number): number => n1 / n2),
}
