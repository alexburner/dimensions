import { FIELD_SIZE } from 'src/constants'
import ParticleN from 'src/particles/ParticleN'

/**
 * Annotation for neighbors within particles array
 */
export interface Neighbor {
  distance: number
  index: number
}

/**
 * Make new particles, optionally using values from old particles
 */
export const makeParticles = (
  dimensions: number,
  particles: number,
  prev: ParticleN[] = [],
): ParticleN[] =>
  new Array(particles).fill(undefined).map((_, i): ParticleN => {
    const particle = new ParticleN(dimensions).randomize(FIELD_SIZE / 2)
    if (prev[i]) particle.backfill(prev[i])
    return particle
  })
