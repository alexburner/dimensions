/**
 * Return a boolean with 50% odds of true/false
 */
export const coinFlip = (): boolean => Math.random() < 0.5

/**
 * Generate a random number within a positive/negative space
 * > default: (-1, 1)
 * > with k: (-k, k)
 */
export const random = (k: number = 1) => {
  const n = Math.random() * k
  return coinFlip() ? n : -n
}

/**
 * Resize a list, creating or destroying elements as needed
 */
export const resizeList = <T>({
  currList,
  newSize,
  createEl,
  destroyEl,
}: {
  currList: T[]
  newSize: number
  createEl: () => T
  destroyEl: (el: T) => void
}): T[] => {
  const newList = [...currList]
  const currSize = currList.length
  const sizeDelta = newSize - currSize
  if (sizeDelta < 0) {
    // Remove elements to fit
    for (let i = newSize; i < currSize; i++) {
      const el = newList.pop()
      destroyEl(el!)
    }
  } else if (sizeDelta > 0) {
    // Add elements to fit
    for (let i = currSize; i < newSize; i++) {
      const el = createEl()
      newList.push(el)
    }
  }
  return newList
}
