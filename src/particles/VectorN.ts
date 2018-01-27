import { coinFlip, random, shuffle } from 'src/util'

/**
 * VectorN is stateful/in-place
 * it suffers the sin of mutation
 * re-using & returning its self
 */
export default class VectorN {
  public static getAverage(vectors: VectorN[]): VectorN {
    if (vectors.length === 0) throw new Error('Cannot average zero vectors')
    const count = vectors.length
    const dimensions = vectors[0].dimensions
    const average = new VectorN(dimensions)
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < dimensions; j++) {
        average.values[j] = average.values[j] + vectors[i].values[j] / count
      }
    }
    return average
  }

  public add = currySelfMath(this, (an, bn) => an + bn)
  public subtract = currySelfMath(this, (an, bn) => an - bn)
  public multiply = currySelfMath(this, (an, bn) => an * bn)
  public divide = currySelfMath(this, (an, bn) => an / bn)

  public readonly dimensions: number
  private values: Float32Array
  private magnitude: number | undefined
  private magnitudeSq: number | undefined

  constructor(arg: number | Float32Array) {
    if (typeof arg === 'number') {
      // Arg is number of dimensions
      this.values = new Float32Array(arg)
      this.dimensions = this.values.length
    } else {
      // Arg is existing Float32Array
      this.values = new Float32Array(arg)
      this.dimensions = this.values.length
    }
  }

  public clone(): VectorN {
    const clone = new VectorN(this.values)
    clone.magnitude = this.magnitude
    clone.magnitudeSq = this.magnitudeSq
    return clone
  }

  public toArray(): Float32Array {
    return new Float32Array(this.values)
  }

  public getValue(index: number): number {
    return this.values[index]
  }

  public setValue(index: number, value: number): this {
    this.values[index] = value
    this.unsetCache()
    return this
  }

  public mutate(iteratee: (value: number, index: number) => number): this {
    for (let i = 0, l = this.dimensions; i < l; i++) {
      this.values[i] = iteratee(this.values[i], i)
    }
    this.unsetCache()
    return this
  }

  public randomize(k: number = 1): this {
    return this.mutate(() => random(k))
  }

  public radialRandomize(radius: number = 1): this {
    let radiusSq = radius * radius
    for (let i = 0, l = this.dimensions; i < l; i++) {
      const value = Math.random() * Math.sqrt(radiusSq)
      const valueSq = value * value
      radiusSq -= valueSq
      this.values[i] = coinFlip() ? value : -value
    }
    shuffle(this.values)
    return this
  }

  public getMagnitude(): number {
    if (this.magnitude === undefined) {
      this.magnitude = Math.sqrt(this.getMagnitudeSq())
    }
    return this.magnitude
  }

  public getMagnitudeSq(): number {
    if (this.magnitudeSq === undefined) {
      let magnitudeSq = 0
      for (let i = 0, l = this.dimensions; i < l; i++) {
        magnitudeSq += this.values[i] * this.values[i]
      }
      this.magnitudeSq = magnitudeSq
    }
    return this.magnitudeSq
  }

  public setMagnitude(target: number): this {
    const current = this.getMagnitude()
    current === 0
      ? this.add(Math.sqrt(target / this.dimensions))
      : this.multiply(target / current)
    this.cacheMagnitude(target)
    return this
  }

  public limitMagnitude(limit: number): this {
    const limitSq = limit * limit
    const currentSq = this.getMagnitudeSq()
    if (currentSq > limitSq) {
      this.multiply(limitSq / currentSq)
      this.cacheMagnitude(limit)
    }
    return this
  }

  private cacheMagnitude(magnitude: number): void {
    this.magnitudeSq = magnitude * magnitude
    this.magnitude = magnitude
  }

  private unsetCache(): void {
    this.magnitudeSq = undefined
    this.magnitude = undefined
  }
}

const currySelfMath = (
  self: VectorN,
  math: (a: number, b: number) => number,
): ((other: VectorN | number) => VectorN) => other => {
  const isNumOther = typeof other === 'number'
  for (let i = 0, l = self.dimensions; i < l; i++) {
    const a = self.getValue(i)
    const b = isNumOther ? (other as number) : (other as VectorN).getValue(i)
    self.setValue(i, math(a, b))
  }
  return self
}
