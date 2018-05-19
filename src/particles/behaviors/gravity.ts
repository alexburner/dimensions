import { Behavior } from 'src/particles/behaviors'
import ParticleN from 'src/particles/ParticleN'
import System from 'src/particles/System'
import { clamp } from 'src/util'

export interface Config {
  charge: number
  mass: number
}

export interface Spec {
  name: 'gravity'
  config: Config
}

export const gravity: Behavior<Config> = (
  system: System,
  config: Config,
): void => {
  // Only works if more than 1 particle
  if (system.particles.length < 2) return

  // Compare each particle to every other particle
  const count = system.particles.length
  const countSq = count * count
  const massSq = config.mass * config.mass
  system.particles.forEach((particle: ParticleN) => {
    // Grab nearest neighbor delta vector & distance
    const { delta, distance } = particle.neighbors[0]
    const force = delta.clone()
    // Constrain distance to prevent strange edges
    const cDistance = clamp(distance, 10, 100) // XXX magic #s
    const cDistanceSq = cDistance * cDistance
    // Set force magnitude with inverse square law + magic
    force.setMagnitude(config.charge * massSq / cDistanceSq / countSq)
    // Accelerate away from neighbor
    particle.acceleration.add(force)
  })
}
