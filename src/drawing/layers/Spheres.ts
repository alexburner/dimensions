import { each, map, reduce } from 'lodash'
import * as THREE from 'three'

import Layer from 'src/drawing/layers/Layer'
import { RenderParticle } from 'src/interfaces'

interface SphereSpec {
  position: THREE.Vector3
  radius: number
}

const SEGMENTS = 40
const RINGS = 40

export default class Spheres extends Layer<SphereSpec> {
  protected makeSpecs(particles: RenderParticle[]): SphereSpec[] {
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
      [] as SphereSpec[],
    )
  }

  protected makeObject(): THREE.Object3D {
    const geometry = new THREE.SphereGeometry(1, SEGMENTS, RINGS)
    const material = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 0.5,
      color: 0xffffff,
    })
    const mesh = new THREE.Mesh(geometry, material)
    return mesh
  }

  protected updateObjects(specs: SphereSpec[]) {
    each(specs, (spec, i) => {
      const object = this.objects[i]
      object.position.x = spec.position.x
      object.position.y = spec.position.y
      object.position.z = spec.position.z
      object.scale.set(spec.radius, spec.radius, spec.radius)
    })
  }
}
