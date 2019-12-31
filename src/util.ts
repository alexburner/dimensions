/**
 * Return a boolean with 50% odds of true/false
 */
export const coinFlip = (): boolean => Math.random() < 0.5

/**
 * Generate a random number within a (-k, k) range
 */
export const random = (k: number = 1): number => {
  const n = Math.random() * k
  return coinFlip() ? n : -n
}

/**
 * Clamp a number to within a range
 */
export const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n))

/**
 * Shuffle array in place
 * https://en.wikipedia.org/wiki/Fisher–Yates_shuffle#The_modern_algorithm
 */
export const shuffle = (arr: Float32Array): void => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const x = arr[i]
    arr[i] = arr[j]
    arr[j] = x
  }
}

/**
 * Keep a list limited to a size, oldest items rolled out first
 */
export class RecentQueue<T> {
  private readonly queue: T[] = []
  private readonly limit: number

  constructor(limit: number) {
    this.limit = limit
  }

  public add(value: T): void {
    this.queue.unshift(value)
    if (this.queue.length > this.limit) this.queue.pop()
  }

  public values(): T[] {
    return this.queue
  }
}

/**
 * Create a fader function for proximity render
 */
const FADE_EDGE_SCALE = 0.2
export const createFaderFn = (
  min: number,
  max: number,
): ((distance: number, value: number) => number) => {
  const proximity = max - min
  const edge = FADE_EDGE_SCALE * proximity
  const minEdgeMin = min
  const minEdgeMax = min + edge
  const maxEdgeMin = max - edge
  const maxEdgeMax = max
  return (distance: number, value: number): number => {
    if (distance >= minEdgeMin && distance <= minEdgeMax) {
      const magnitude = distance - minEdgeMin
      const scale = magnitude / edge
      const scaled = value * scale
      return scaled
    }
    if (distance >= maxEdgeMin && length <= maxEdgeMax) {
      const magnitude = edge - (distance - maxEdgeMin)
      const scale = magnitude / edge
      const scaled = value * scale
      return scaled
    }
    return value
  }
}
