export const coinFlip = (): boolean => Math.random() < 0.5

export const random = (k: number = 1) =>
  coinFlip() ? Math.random() * k * -1 : Math.random() * k
