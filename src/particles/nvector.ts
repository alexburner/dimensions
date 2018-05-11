// XXX currently unused, in favor of VectorN & in-place mutation

/**
 * nvector is functional/pure
 *  it suffers the sin of creation
 *  all returned vectors are new
 */

type Vector = Float32Array

type VectorMath = (a: Vector, b: Vector | number) => Vector
type NumberMath = (an: number, bn: number) => number
const curryMath = (math: NumberMath): VectorMath => (a, b) => {
  const c: Vector = new Float32Array(a.length)
  const isNumB = typeof b === 'number'
  for (let i = 0, l = a.length; i < l; i++) {
    const an = a[i]
    const bn = isNumB ? (b as number) : (b as Vector)[i]
    c[i] = math(an, bn)
  }
  return c
}

export const add: VectorMath = curryMath((an, bn) => an + bn)
export const subtract: VectorMath = curryMath((an, bn) => an - bn)
export const multiply: VectorMath = curryMath((an, bn) => an * bn)
export const divide: VectorMath = curryMath((an, bn) => an / bn)

export const getDistance = (a: Vector, b: Vector): number =>
  Math.sqrt(getDistanceSq(a, b))

export const getDistanceSq = (a: Vector, b: Vector): number => {
  const delta = subtract(a, b)
  return getMagnitudeSq(delta)
}

export const getMagnitude = (v: Vector): number => Math.sqrt(getMagnitudeSq(v))

export const getMagnitudeSq = (v: Vector): number => {
  let magnitudeSq = 0
  for (let i = 0, l = v.length; i < l; i++) {
    magnitudeSq += v[i] * v[i]
  }
  return magnitudeSq
}

export const setMagnitude = (v: Vector, magnitude: number): Vector => {
  const prevMagnitude = getMagnitude(v)
  return prevMagnitude === 0
    ? add(v, Math.sqrt(magnitude / v.length))
    : multiply(v, magnitude / prevMagnitude)
}

export const limitMagnitude = (v: Vector, limit: number): Vector => {
  const limitSq = limit * limit
  const currSq = getMagnitudeSq(v)
  return currSq > limitSq ? multiply(v, limitSq / currSq) : new Float32Array(v)
}

export const getAverage = (vectors: Vector[]): Vector => {
  if (vectors.length === 0) throw new Error('Cannot average zero vectors')
  const count = vectors.length
  const dimensions = vectors[0].length
  const average: Vector = new Float32Array(dimensions)
  for (let i = 0; i < count; i++) {
    for (let j = 0; j < dimensions; j++) {
      average[j] = average[j] + vectors[i][j] / count
    }
  }
  return average
}
