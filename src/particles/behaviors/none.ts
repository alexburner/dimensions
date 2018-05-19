import { Behavior } from 'src/particles/behaviors'
import ParticleN from 'src/particles/ParticleN'
import System from 'src/particles/System'

export interface Config {}

export interface Spec {
  name: 'none'
  config: Config
}

export const none: Behavior<Config> = (
  system: System,
  config: Config,
): void => {
  system.particles.forEach((p: ParticleN) => p.velocity.multiply(0))
}
