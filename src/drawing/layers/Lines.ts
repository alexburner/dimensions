import { each, map, reduce } from 'lodash'
import * as THREE from 'three'

import Line from 'src/drawing/elements/Line'
import { RenderParticle } from 'src/interfaces'

interface LineSpec {
  source: THREE.Vector3
  target: THREE.Vector3
}

export default class Lines {
  private scene: THREE.Scene
  private lines: Line[] = []

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  public tick(particles: RenderParticle[]) {
    // 1. generate fresh list of specs
    const specs: LineSpec[] = reduce(
      particles,
      (memo, particle) => {
        each(particle.neighborIndices, i => {
          const neighbor = particles[i]
          memo.push({
            source: particle.location,
            target: neighbor.location
          })
        })
        return memo
      },
      [] as LineSpec[]
    )

    // 2. add/remove current objects to match
    const currCount = this.lines.length
    const nextCount = specs.length
    const diffCount = nextCount - currCount
    if (diffCount < 0) {
      // remove extra objects from scene
      for (let i = nextCount - 1; i < currCount; i++) {
        const line = this.lines[i]
        this.scene.remove(line.object)
      }
      // remove extra objects from list
      this.lines = this.lines.slice(0, nextCount)
    } else if (diffCount > 0) {
      // add missing objects to scene & list
      for (let i = currCount; i < nextCount; i++) {
        const line = new Line()
        this.scene.add(line.object)
        this.lines.push(line)
      }
    }

    // 3. update all objects with new positions
    each(this.lines, (line, i) => line.setPosition(
      specs[i].source,
      specs[i].target,
    ))
  }

  public clear() {
    each(this.lines, line => this.scene.remove(line.object))
    this.lines = []
  }
}
