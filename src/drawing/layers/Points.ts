import { each, map } from 'lodash'
import * as THREE from 'three'

import Point from 'src/drawing/elements/Point'
import { math, toVector3, VectorN } from 'src/geometry/vector-n'
import { Particle } from 'src/interfaces'

interface PointSpec {
  position: VectorN
}

export default class Points {
  private scene: THREE.Scene
  private points: Point[] = []

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  public tick(particles: Particle[], width: number, height: number) {
    const size = Math.min(width, height)

    // 1. generate fresh list of specs
    const specs = map(particles, particle => ({
      position: toVector3(math.multiply(particle.location, size / 2)),
    }))

    // 2. add/remove current objects to match
    const currCount = this.points.length
    const nextCount = specs.length
    const diffCount = nextCount - currCount
    if (diffCount < 0) {
      // remove extra objects from scene
      for (let i = nextCount - 1; i < currCount; i++) {
        const point = this.points[i]
        this.scene.remove(point.object)
      }
      // remove extra objects from list
      this.points = this.points.slice(0, nextCount)
    } else if (diffCount > 0) {
      // add missing objects to scene & list
      for (let i = currCount; i < nextCount; i++) {
        const point = new Point()
        this.scene.add(point.object)
        this.points.push(point)
      }
    }

    // 3. update all objects with new positions
    each(this.points, (point, i) => point.setPosition(specs[i].position))
  }

  public clear() {
    each(this.points, point => this.scene.remove(point.object))
    this.points = []
  }
}
