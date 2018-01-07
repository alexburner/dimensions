import { Neighbor } from 'src/particles/System'
import VectorN from 'src/particles/VectorN'

/**
 * Particle using VectorN
 */
export default class ParticleN {
  public dimensions: number
  public position: VectorN
  public velocity: VectorN
  public acceleration: VectorN
  public neighbors: Neighbor[]

  constructor(dimensions: number) {
    this.dimensions = dimensions
    this.position = new VectorN(dimensions)
    this.velocity = new VectorN(dimensions)
    this.acceleration = new VectorN(dimensions)
    this.neighbors = []
  }

  public randomize(k: number = 1): ParticleN {
    radialRandomize(this.position, k)
    this.velocity.randomize(k)
    this.acceleration.randomize(k)
    return this
  }

  public backfill(other: ParticleN): ParticleN {
    this.position.mutate((v, i) => other.position.value(i) || v)
    this.velocity.mutate((v, i) => other.velocity.value(i) || v)
    this.acceleration.mutate((v, i) => other.acceleration.value(i) || v)
    return this
  }
}

/**
 * Place a vector randomly, radially
 * (w/in point, line, circle, sphere)
 *
 * TODO would prefer something dimensionally agnostic
 *   - rotation matricies? (how to work with x, y, z?)
 *   - quaternions? (I think they may be 3D-specific)
 *
 * HM for matrix rotation:
 *   1. find random magnitude w/in k (MAX_RADIUS)
 *   2. rotate random magnitude through 0D, 1D, 2D, 3D, etc
 *   ?
 *
 * Try https://www.essentialmath.com/GDC2012/GDC2012_JMV_Rotations.pdf
 * (has 2D and 3D matrix rotations, at least)
 *
 * Could just skip 0D and 1D rotations I suppose
 * (1D would need special handling to flip pos/neg)
 * But how do higher dimensional radial?
 *
 */
const radialRandomize = (position: VectorN, k: number = 1) => {
  switch (position.dimensions) {
    case 2: {
      // Place within circle (radius, angle)
      // https://en.wikipedia.org/wiki/Rotation_of_axes#Method_1
      const radius = Math.random() * k
      const angle = Math.random() * 2 * Math.PI
      const ox = radius
      const oy = 0
      const x = ox * Math.cos(angle) + oy * Math.sin(angle)
      const y = -ox * Math.sin(angle) + oy * Math.cos(angle)
      const values = [x, y]
      position.mutate((_, i) => values[i])
      break
    }
    case 3: {
      // Place within sphere (radius, azimuth, elevation)
      // https://en.wikipedia.org/wiki/Spherical_coordinate_system#Cartesian_coordinates
      const radius = Math.random() * k
      const azimuth = Math.random() * 2 * Math.PI
      const inclination = Math.random() * 2 * Math.PI
      const x = radius * Math.sin(inclination) * Math.cos(azimuth)
      const y = radius * Math.sin(inclination) * Math.sin(azimuth)
      const z = radius * Math.cos(inclination)
      const values = [x, y, z]
      position.mutate((_, i) => values[i])
      break
    }
    default: {
      // This actually works for most, kinda
      // 0 = point: nothing to be done
      // 1 = line: random w/in number line
      // 4+ = uh: I dunno radial hyper+ space... yet
      position.randomize(k)
      break
    }
  }
}
