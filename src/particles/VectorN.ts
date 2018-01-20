import { coinFlip, random, shuffle } from 'src/util'

/**
 * N-dimensional vector math
 *
 * VectorN supports n dimensions by using lists to hold values
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
 * VectorN arithmetic methods support both vectors and numbers:
 *  const vectorC = VectorN.add(vectorA, vectorB)
 *  const vectorC = VectorN.add(vectorA, 10)
 *
 * VectorN instance methods mutate the instance:
 *  vectorA.add(vectorB)
 *  vectorA.add(10)
 *
 * VectorN instance methods are chainable (where reasonable):
 *  vectorA.add(10).multiply(11).limit(20) // yes
 *  vectorA.add(10).getMagnitude().limit(20) // no
 *
 * VectorN instance magnitude measurements are memoized, resets when needed:
 *  vectorA.multiply(10) // magnitude cache reset
 *  vectorA.getMagnitude() // new magnitude calculated
 *  vectorA.getMagnitude() // magnitude cache hit
 *
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
    const c = new VectorN(a.dimensions)
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
    return delta.getMagnitudeSq()
  }

  /**
   * Use the average of a list of vectors to create a new vector
   */
  public static getAverage(vectors: VectorN[]): VectorN {
    const count = vectors.length
    if (count === 0) throw new Error('Cannot average zero vectors')
    const average = new VectorN(vectors[0].dimensions)
    vectors.forEach(vector => {
      vector.values.forEach((value, i) => {
        average.values[i] = average.values[i] + value / count
      })
    })
    return average
  }

  /**
   * The number of spatial dimensions this vector represents
   * (can be any integer, but cannot be changed after init)
   */
  public readonly dimensions: number

  /**
   * The coords of a vector
   * (index maps to spatial dimensions [1, 2, 3, etc])
   */
  private values: Float32Array

  /**
   * Cache for magnitude memoization
   */
  private magnitude: number | undefined

  /**
   * Cache for squared magnitude memoization
   */
  private magnitudeSq: number | undefined

  /**
   * Construct a new VectorN instance
   * with dimension count and optional fill
   */
  constructor(dimensions: number, fill?: number) {
    this.dimensions = dimensions
    this.values = new Float32Array(dimensions)
    if (fill !== undefined) this.values.fill(fill)
  }

  /**
   * Create a copy of this vector
   */
  public clone(): VectorN {
    const clone = new VectorN(this.dimensions)
    clone.values = this.toArray()
    clone.magnitude = this.magnitude
    clone.magnitudeSq = this.magnitudeSq
    return clone
  }

  /**
   * Get values
   */
  public toArray(): Float32Array {
    return new Float32Array(this.values)
  }

  /**
   * Get value at a given index
   */
  public value(i: number): number {
    return this.values[i]
  }

  /**
   * Fill this vector with random numbers in (-k, k) range
   */
  public randomize(k: number = 1): VectorN {
    return this.mutate(() => random(k))
  }

  /**
   * Fill this vector with random numbers within a radial space
   *
   * algorithm via Colin Ballast:
   *   keeps vector distance from origin within "radius" value
   *   by progressively subtracting previous values
   *   from available numeric space for Math.random
   *   then shuffling resulting values
   *   to scatter randomly across
   *   available dimensions
   *
   * also
   *   randomly flips positive/negative
   *   to spread through all quadrants
   *
   */
  public radialRandomize(radius: number = 1): VectorN {
    let distanceSq = radius * radius
    const values = new Float32Array(this.dimensions).map(() => {
      const value = Math.random() * Math.sqrt(distanceSq)
      distanceSq -= value * value
      return coinFlip() ? value : -value
    })
    shuffle(values)
    this.values = values
    return this
  }

  /**
   * Map over this vector's values, and replace them with the result
   */
  public mutate(
    iteratee: (value: number, index: number, values: Float32Array) => number,
  ): VectorN {
    this.values = this.values.map(iteratee)
    this.cacheMagnitude(undefined) // reset cache
    return this
  }

  /**
   * Find this vector's magnitude
   */
  public getMagnitude(): number {
    if (this.magnitude === undefined) {
      this.magnitude = Math.sqrt(this.getMagnitudeSq())
    }
    return this.magnitude
  }

  /**
   * Find this vector's magnitude square
   */
  public getMagnitudeSq(): number {
    if (this.magnitudeSq === undefined) {
      this.magnitudeSq = this.values.reduce((memo, n) => memo + n * n, 0)
    }
    return this.magnitudeSq
  }

  /**
   * Set this vector's magnitude
   */
  public setMagnitude(magnitude: number): VectorN {
    if (this.getMagnitude() > 0) this.multiply(magnitude / this.getMagnitude())
    else this.add(Math.sqrt(magnitude / this.values.length)) // XXX zero vector
    this.cacheMagnitude(magnitude)
    return this
  }

  /**
   * Limit this vector's magnitude to within a given value
   */
  public limit(magnitude: number): VectorN {
    const target = magnitude * magnitude
    const current = this.getMagnitudeSq()
    if (current > target) {
      this.multiply(target / current)
      this.cacheMagnitude(target)
    }
    return this
  }

  /**
   * Add another vector's values (or a constant) to this vector
   */
  public add(other: VectorN | number): VectorN {
    this.values = VectorN.add(this, other).values
    this.cacheMagnitude(undefined)
    return this
  }

  /**
   * Subtract another vector's values (or a constant) from this vector
   */
  public subtract(other: VectorN | number): VectorN {
    this.values = VectorN.subtract(this, other).values
    this.cacheMagnitude(undefined)
    return this
  }

  /**
   * Multiply another vector's values (or a constant) to this vector
   */
  public multiply(other: VectorN | number): VectorN {
    this.values = VectorN.multiply(this, other).values
    this.cacheMagnitude(undefined)
    return this
  }

  /**
   * Divide another vector's values (or a constant) from this vector
   */
  public divide(other: VectorN | number): VectorN {
    this.values = VectorN.divide(this, other).values
    this.cacheMagnitude(undefined)
    return this
  }

  /**
   * Set this vector's magnitude cache (undefined to reset)
   */
  private cacheMagnitude(value: number | undefined) {
    this.magnitudeSq = value !== undefined ? value * value : value
    this.magnitude = value
  }
}
