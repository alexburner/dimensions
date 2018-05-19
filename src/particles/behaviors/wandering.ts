import { Behavior } from 'src/particles/behaviors'
import ParticleN from 'src/particles/ParticleN'
import System from 'src/particles/System'
import VectorN from 'src/particles/VectorN'

export interface Config {
  jitter: number
}

export interface Spec {
  name: 'wandering'
  config: Config
}

export const wandering: Behavior<Config> = (
  system: System,
  config: Config,
): void => {
  system.particles.forEach((particle: ParticleN) => {
    // Generate random acceleration & add to particle
    const random = new VectorN(particle.dimensions)
    random.randomize(config.jitter)
    particle.acceleration.add(random)
  })
}
