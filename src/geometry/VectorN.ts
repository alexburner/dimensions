/**
 * N-dimensional vector math
 *
 * VectorN supports n dimensions by using lists to hold scalars
 *  Vector0 { }          ->  VectorN [ ]
 *  Vector1 { x }        ->  VectorN [ x ]
 *  Vector2 { x, y }     ->  VectorN [ x, y ]
 *  Vector3 { x, y, z }  ->  VectorN [ x, y, z ]
 *  ...etc
 *
 * VectorN instances are constructed with dimension count and optional fill:
 *  const vectorA = new Vector(3)    // vectorA.values -> [0, 0, 0]
 *  const vectorB = new Vector(3, 5) // vectorB.values -> [5, 5, 5]
 *
 * VectorN instance values can be manipulated directly:
 *  vectorA.values = vectorA.values.map(() => Math.random() * 10)
 *
 * VectorN arithmetic methods support both vectors and scalars:
 *  const vectorC = VectorN.add(vectorA, vectorB)
 *  const vectorC = VectorN.add(vectorA, 10)
 *
 * VectorN instance methods mutate the instance:
 *  vectorA.add(vectorB)
 *  vectorA.add(10)
 *
 * VectorN instance length measurements are memoized (resets cache if needed):
 *  vectorA.multiply(10) // memo cache reset
 *  vectorA.getLength() // new length calculated
 *  vectorA.getLength() // memo cache hit
 *
 * Danger! VectorN assumes all vectors share the same number of dimensions:
 *  const vectorA = new Vector(2) // 2-dimensional
 *  const vectorB = new Vector(3) // 3-dimensional
 *  const vectorC = VectorN.add(vectorA, vectorB) // ? 2-dimensional
 *  const vectorD = VectorN.add(vectorB, vectorA) // ? 3-dimensional with NaN
 *
 * VectorN is intended for algorithms that can support an arbitrary number of
 * spatial dimensions, not for direct vector math across different spaces.
 *
 */
export default class VectorN {
  public static merge(
    a: VectorN,
    b: VectorN | number,
    calc: (a: number, b: number) => number,
  ): VectorN {
    const isNumB = typeof b === 'number'
    const c = new VectorN(a.values.length)
    c.values = a.values.map((aValue, i) => {
      const bValue = isNumB ? (b as number) : (b as VectorN).values[i]
      return calc(aValue, bValue)
    })
    return c
  }

  public static add(a: VectorN, b: VectorN | number): VectorN {
    return VectorN.merge(a, b, (na, nb) => na + nb)
  }

  public static subtract(a: VectorN, b: VectorN | number): VectorN {
    return VectorN.merge(a, b, (na, nb) => na - nb)
  }

  public static multiply(a: VectorN, b: VectorN | number): VectorN {
    return VectorN.merge(a, b, (na, nb) => na * nb)
  }

  public static divide(a: VectorN, b: VectorN | number): VectorN {
    return VectorN.merge(a, b, (na, nb) => na / nb)
  }

  public static getDistance(a: VectorN, b: VectorN): number {
    return Math.sqrt(VectorN.getDistanceSq(a, b))
  }

  public static getDistanceSq(a: VectorN, b: VectorN): number {
    const delta = VectorN.subtract(a, b)
    return delta.getLengthSq()
  }

  public static getAverage(vectors: VectorN[]): VectorN {
    const count = vectors.length
    if (count === 0) throw new Error('Cannot average zero vectors')
    const dimensions = vectors[0].length || 0
    const average = new VectorN(dimensions)
    vectors.forEach(vector => {
      vector.values.forEach((value, i) => {
        average.values[i] = average.values[i] + value / count
      })
    })
    return average
  }

  public values: Float32Array
  private length: number | undefined
  private lengthSq: number | undefined

  constructor(dimensions: number, n?: number) {
    this.values = new Float32Array(dimensions)
    if (n !== undefined) this.values.fill(n)
  }

  public getLength(): number {
    if (this.length === undefined) {
      this.length = Math.sqrt(this.getLengthSq())
    }
    return this.length
  }

  public getLengthSq(): number {
    if (this.lengthSq === undefined) {
      this.lengthSq = this.values.reduce((memo, n) => memo + n * n, 0)
    }
    return this.lengthSq
  }

  public setLength(length: number) {
    this.multiply(length / this.getLength())
    this.length = length
    this.lengthSq = length * length
  }

  public limit(length: number) {
    const limitLengthSq = length * length
    const currLengthSq = this.getLengthSq()
    if (currLengthSq > limitLengthSq) {
      this.multiply(limitLengthSq / currLengthSq)
    }
  }

  public add(other: VectorN | number) {
    const result = VectorN.add(this, other)
    this.values = result.values
    this.length = undefined
    this.lengthSq = undefined
  }

  public subtract(other: VectorN | number) {
    const result = VectorN.subtract(this, other)
    this.values = result.values
    this.length = undefined
    this.lengthSq = undefined
  }

  public multiply(other: VectorN | number) {
    const result = VectorN.multiply(this, other)
    this.values = result.values
    this.length = undefined
    this.lengthSq = undefined
  }

  public divide(other: VectorN | number) {
    const result = VectorN.divide(this, other)
    this.values = result.values
    this.length = undefined
    this.lengthSq = undefined
  }
}
