import { Behavior } from 'src/particles/behaviors'
import ParticleN from 'src/particles/ParticleN'
import System from 'src/particles/System'
import { clamp } from 'src/util'

export interface Config {
  mass: {
    g: number
    orbiter: number
    attractor: number
  }
  distance: {
    min: number
    max: number
  }
}

export interface Spec {
  name: 'orbits'
  config: Config
}

export const orbits: Behavior<Config> = (
  system: System,
  config: Config,
): void => {
  // Attract each particle to the center
  const minDistSq = config.distance.min * config.distance.min
  const maxDistSq = config.distance.max * config.distance.max
  const mass = config.mass
  system.particles.forEach((particle: ParticleN) => {
    const force = particle.position.clone().multiply(-1) // vector to center
    const distanceSq = clamp(force.getMagnitudeSq(), minDistSq, maxDistSq)
    const strength = mass.g * mass.attractor * mass.orbiter / distanceSq
    force.setMagnitude(strength)
    force.divide(config.mass.orbiter)
    particle.acceleration.add(force)
  })
}
