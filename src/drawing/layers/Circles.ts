import { each, map, reduce } from 'lodash'
import * as THREE from 'three'

import Layer from 'src/drawing/layers/Layer'
import { RenderParticle } from 'src/interfaces'

interface CircleSpec {
  position: THREE.Vector3
  radius: number
}

const DIVISIONS = 64

export default class Circles extends Layer<CircleSpec> {
  protected makeSpecs(particles: RenderParticle[]): CircleSpec[] {
    return reduce(
      particles,
      (memo, particle) => {
        each(particle.neighborIndices, i => {
          const neighbor = particles[i]
          // TODO store this data in neighbor list
          const delta = particle.location.clone().sub(neighbor.location)
          memo.push({
            position: particle.location,
            radius: delta.length(),
          })
        })
        return memo
      },
      [] as CircleSpec[],
    )
  }

  protected makeObject(): THREE.Object3D {
    const shape = new THREE.Shape()
    shape.arc(0, 0, 1, 0, 2 * Math.PI, false)
    shape.autoClose = true
    const points2 = shape.getSpacedPoints(DIVISIONS)
    const points3 = points2.map(p => new THREE.Vector3(p.x, p.y, 0))
    const geometry = new THREE.BufferGeometry()
    geometry.setFromPoints(points3)
    const material = new THREE.LineBasicMaterial({ color: 0xffffff })
    const line = new THREE.Line(geometry, material)
    return line
  }

  protected updateObjects(specs: CircleSpec[]) {
    each(specs, (spec, i) => {
      const object = this.objects[i]
      object.position.x = spec.position.x
      object.position.y = spec.position.y
      object.position.z = spec.position.z
      object.scale.set(spec.radius, spec.radius, spec.radius)
    })
  }
}
