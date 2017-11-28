import { each, reduce } from 'lodash'
import * as THREE from 'three'

import Layer from 'src/drawing/layers/Layer'
import { RenderParticle } from 'src/interfaces'

interface SphereSpec {
  position: THREE.Vector3
  radius: number
}

const OPACITY_MAX = 0.5
const OPACITY_MIN = 0.2
const SEGMENTS = 40
const RINGS = 40

const getOpacity = (count: number): number =>
  Math.max(OPACITY_MIN, Math.min(OPACITY_MAX, 3 / count)) // magic

export default class Spheres extends Layer<SphereSpec> {
  protected makeSpecs(particles: RenderParticle[]): SphereSpec[] {
    return reduce(
      particles,
      (memo, particle) => {
        each(particle.neighbors, neighbor => {
          memo.push({
            position: particle.location,
            radius: neighbor.distance,
          })
        })
        return memo
      },
      [] as SphereSpec[],
    )
  }

  protected makeObject(): THREE.Object3D {
    const geometry = new THREE.SphereGeometry(1, SEGMENTS, RINGS)
    const material = new THREE.MeshNormalMaterial({
      blending: THREE.AdditiveBlending,
      depthTest: false,
      opacity: OPACITY_MAX,
      transparent: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    return mesh
  }

  protected updateObjects(specs: SphereSpec[]) {
    const opacity = getOpacity(specs.length)
    each(specs, (spec, i) => {
      const object = this.objects[i] as THREE.Mesh
      object.position.x = spec.position.x
      object.position.y = spec.position.y
      object.position.z = spec.position.z
      object.scale.set(spec.radius, spec.radius, spec.radius)
      const material = object.material as THREE.MeshNormalMaterial
      material.opacity = opacity
    })
  }
}
