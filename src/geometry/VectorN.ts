/**
 * Return a boolean with 50% odds of true/false
 */
const coinFlip = (): boolean => Math.random() < 0.5

/**
 * Generate a random number within a (-k, k) range
 */
const random = (k: number = 1) => {
  const n = Math.random() * k
  return coinFlip() ? n : -n
}

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
 * VectorN instance methods are chainable (where reasonable):
 *  vectorA.add(10).multiply(11).limit(20) // yes
 *  vectorA.add(10).getLength().limit(20) // no
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
  /**
   * Merge two vectors (or one vector and one constant) into a single new vector
   * using the passed calc function to combine each pair of values
   */
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

  /**
   * Use the sum of two vectors (or a constant) to create a new vector
   */
  public static add(a: VectorN, b: VectorN | number): VectorN {
    return VectorN.merge(a, b, (na, nb) => na + nb)
  }

  /**
   * Use the difference of two vectors (or a constant) to create a new vector
   */
  public static subtract(a: VectorN, b: VectorN | number): VectorN {
    return VectorN.merge(a, b, (na, nb) => na - nb)
  }

  /**
   * Use the product of two vectors (or a constant) to create a new vector
   */
  public static multiply(a: VectorN, b: VectorN | number): VectorN {
    return VectorN.merge(a, b, (na, nb) => na * nb)
  }

  /**
   * Use the dividend of two vectors (or a constant) to create a new vector
   */
  public static divide(a: VectorN, b: VectorN | number): VectorN {
    return VectorN.merge(a, b, (na, nb) => na / nb)
  }

  /**
   * Find the distance between two vectors
   */
  public static getDistance(a: VectorN, b: VectorN): number {
    return Math.sqrt(VectorN.getDistanceSq(a, b))
  }

  /**
   * Find the squared distance between two vectors
   */
  public static getDistanceSq(a: VectorN, b: VectorN): number {
    const delta = VectorN.subtract(a, b)
    return delta.getLengthSq()
  }

  /**
   * Use the average of a list of vectors to create a new vector
   */
  public static getAverage(vectors: VectorN[]): VectorN {
    const count = vectors.length
    if (count === 0) throw new Error('Cannot average zero vectors')
    const dimensions = vectors[0].values.length
    const average = new VectorN(dimensions)
    vectors.forEach(vector => {
      vector.values.forEach((value, i) => {
        average.values[i] = average.values[i] + value / count
      })
    })
    return average
  }

  /**
   * Create a new copy of a vector
   */
  public static clone(v: VectorN): VectorN {
    const clone = new VectorN(v.values.length)
    clone.mutate((_, i) => v.values[i])
    return clone
  }

  /**
   * The coords of a vector (index maps to spatial dimensions [1, 2, 3, etc])
   */
  public values: Float32Array

  /**
   * Construct a new VectorN instance, with dimension count and optional fill
   */
  constructor(dimensions: number, fill?: number) {
    this.values = new Float32Array(dimensions)
    if (fill !== undefined) this.values.fill(fill)
  }

  /**
   * Fill vector with random numbers in (-k, k) range
   */
  public randomize(k: number = 1): VectorN {
    return this.mutate(() => random(k))
  }

  /**
   * Map over vector's values, replacing them with the result
   */
  public mutate(
    callback: (value: number, index: number, values: Float32Array) => number,
  ): VectorN {
    this.values = this.values.map(callback)
    return this
  }

  /**
   * Find vector magnitude
   */
  public getLength(): number {
    return Math.sqrt(this.getLengthSq())
  }

  /**
   * Find squared vector magnitude
   */
  public getLengthSq(): number {
    return this.values.reduce((memo, n) => memo + n * n, 0)
  }

  /**
   * Set vector magnitude
   */
  public setLength(length: number): VectorN {
    this.multiply(length / this.getLength())
    return this
  }

  /**
   * Limit vector magnitude to within a given value
   */
  public limit(length: number): VectorN {
    const limitLengthSq = length * length
    const currLengthSq = this.getLengthSq()
    if (currLengthSq > limitLengthSq) {
      this.multiply(limitLengthSq / currLengthSq)
    }
    return this
  }

  /**
   * Add another vector's values (or a constant) to this vector
   */
  public add(other: VectorN | number): VectorN {
    this.values = VectorN.add(this, other).values
    return this
  }

  /**
   * Subtract another vector's values (or a constant) from this vector
   */
  public subtract(other: VectorN | number): VectorN {
    this.values = VectorN.subtract(this, other).values
    return this
  }

  /**
   * Multiply another vector's values (or a constant) to this vector
   */
  public multiply(other: VectorN | number): VectorN {
    this.values = VectorN.multiply(this, other).values
    return this
  }

  /**
   * Divide another vector's values (or a constant) from this vector
   */
  public divide(other: VectorN | number): VectorN {
    this.values = VectorN.divide(this, other).values
    return this
  }
}
