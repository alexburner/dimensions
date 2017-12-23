import { Behavior } from 'src/particles/behaviors'
import System from 'src/particles/System'

export interface Config {
  charge: number
}

export interface Spec {
  name: 'diffusion'
  config: Config
}

export const diffusion: Behavior<Config> = (system: System, config: Config) => {
  // Only works if more than 1 particle
  if (system.particles.length < 2) return

  // Compare each particle to every other particle
  system.particles.forEach(particle => {
    // Grab nearest neighbor delta vector & distance
    const { delta, distance } = particle.neighbors[0]
    // Set force magnitude with inverse square law
    delta.setMagnitude(config.charge * config.charge / (distance * distance))
    // Accelerate away from neighbor
    particle.acceleration.add(delta)
  })
}
