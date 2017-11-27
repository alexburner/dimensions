import { each, reduce } from 'lodash'
import * as THREE from 'three'

import Layer from 'src/drawing/layers/Layer'
import { RenderParticle } from 'src/interfaces'

interface LineSpec {
  source: THREE.Vector3
  target: THREE.Vector3
}

export default class Lines extends Layer<LineSpec> {
  protected makeSpecs(particles: RenderParticle[]): LineSpec[] {
    return reduce(
      particles,
      (memo, particle) => {
        each(particle.neighbors, neighbor => {
          memo.push({
            source: particle.location,
            target: particles[neighbor.index].location,
          })
        })
        return memo
      },
      [] as LineSpec[],
    )
  }

  protected makeObject(): THREE.Object3D {
    const geometry = new THREE.BufferGeometry()
    const source = new THREE.Vector3(0, 0, 0)
    const target = new THREE.Vector3(0, 0, 0)
    geometry.setFromPoints([source, target])
    const material = new THREE.LineBasicMaterial({ color: 0xffffff })
    const line = new THREE.Line(geometry, material)
    return line
  }

  protected updateObjects(specs: LineSpec[]) {
    each(specs, (spec, i) => {
      const object = this.objects[i] as THREE.Line
      const geometry = object.geometry as THREE.BufferGeometry
      geometry.setFromPoints([spec.source, spec.target])
    })
  }
}
