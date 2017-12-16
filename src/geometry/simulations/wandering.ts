import { ParticleN } from 'src/geometry/particles'
import { SharedConfig, Simulation } from 'src/geometry/simulations'
import VectorN from 'src/geometry/VectorN'

export interface Config extends SharedConfig {
  jitter: number
}

export interface Spec {
  name: 'wandering'
  config: Config
}

export const wandering: Simulation<Config> = (
  particles: ParticleN[],
  config: Config,
) => {
  particles.forEach(particle => {
    // Generate random acceleration & add to particle
    const random = new VectorN(particle.acceleration.values.length)
    random.randomize(config.jitter)
    particle.acceleration.add(random)
  })
}
