import { Behavior } from 'src/particles/behaviors'
import System from 'src/particles/System'

export interface Config {
  charge: number
}

export interface Spec {
  name: 'diffusionX'
  config: Config
}

/**
 * Mimicks initial diffusion attempt, where magniftude of repulsive force
 * is directly proportional to distance, instead of inversely proportional
 */
export const diffusionX: Behavior<Config> = (
  system: System,
  config: Config,
) => {
  if (system.particles.length < 2) return
  system.particles.forEach(particle => {
    const { delta } = particle.neighbors[0]
    delta.multiply(config.charge)
    particle.acceleration.add(delta)
  })
}
