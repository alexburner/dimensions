import { each, map } from 'lodash'
import * as THREE from 'three'

import Layer from 'src/drawing/layers/Layer'
import { RenderParticle } from 'src/interfaces'

interface PointSpec {
  position: THREE.Vector3
}

const getTexture = (): THREE.Texture => {
  const SIZE = 256
  const PAD = 4
  const radius = SIZE / 2 - PAD
  const center = SIZE / 2
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const context = canvas.getContext('2d')
  context!.beginPath()
  context!.arc(center, center, radius, 0, 2 * Math.PI)
  context!.fillStyle = 'rgba(255, 255, 255, 1)'
  context!.fill()
  return new THREE.CanvasTexture(canvas)
}

export default class Points extends Layer<PointSpec> {
  private static texture = getTexture()

  protected makeSpecs(particles: RenderParticle[]): PointSpec[] {
    return map(particles, particle => ({
      position: particle.location,
    }))
  }

  protected makeObject(): THREE.Object3D {
    const geometry = new THREE.BufferGeometry()
    geometry.setFromPoints([new THREE.Vector3()])
    const material = new THREE.PointsMaterial({
      map: Points.texture,
      transparent: true,
      size: 20,
    })
    const point = new THREE.Points(geometry, material)
    return point
  }

  protected updateObjects(specs: PointSpec[]) {
    each(specs, (spec, i) => {
      const object = this.objects[i]
      object.position.x = spec.position.x
      object.position.y = spec.position.y
      object.position.z = spec.position.z
    })
  }
}
