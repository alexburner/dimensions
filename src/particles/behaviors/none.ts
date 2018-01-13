import { Behavior } from 'src/particles/behaviors'
import System from 'src/particles/System'

export interface Config {}

export interface Spec {
  name: 'none'
  config: Config
}

export const none: Behavior<Config> = (system: System, config: Config) => {
  system.particles.forEach(p => p.velocity.multiply(0))
}
