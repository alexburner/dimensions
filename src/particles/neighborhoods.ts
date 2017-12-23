import ParticleN from 'src/particles/ParticleN'

/**
 * For transport to main UI thread:
 * array of particle index -> neighbors
 */
export type Neighborhood = {
  index: number
  distance: number
}[][]

interface NeighborhoodSpec {
  name: string
  config?: { [prop: string]: any }
}

interface AllSpec extends NeighborhoodSpec {
  name: 'all'
}

interface LocalSpec extends NeighborhoodSpec {
  name: 'locals'
}

interface NearestSpec extends NeighborhoodSpec {
  name: 'nearest'
}

interface ProximitySpec extends NeighborhoodSpec {
  name: 'proximity'
  config: {
    min: number
    max: number
  }
}

export type NeighborhoodSpecs =
  | AllSpec
  | LocalSpec
  | NearestSpec
  | ProximitySpec

export const getNeighborhood = (
  particles: ParticleN[],
  spec: NeighborhoodSpecs,
): Neighborhood => {
  switch (spec.name) {
    case 'all':
      return particles.map(p =>
        p.neighbors.map(n => ({ index: n.index, distance: n.distance })),
      )
    case 'locals':
      return particles.map(p =>
        p.neighbors
          .slice(0, p.dimensions)
          .map(n => ({ index: n.index, distance: n.distance })),
      )
    case 'nearest':
      return particles.map(p =>
        p.neighbors
          .slice(0, 1)
          .map(n => ({ index: n.index, distance: n.distance })),
      )
    case 'proximity':
      throw new Error('TODO: proximity neighborhood')
  }
}
