import { each, map } from 'lodash'
import * as THREE from 'three'

import Layer from 'src/drawing/layers/Layer'
import { Particle3 } from 'src/geometry/particles'

interface PointSpec {
  position: THREE.Vector3
}

const SIZE = 12

const getTexture = (): THREE.Texture => {
  const size = 256
  const padding = 4
  const radius = size / 2 - padding
  const center = size / 2
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Failed to get 2d canvas context')
  context.beginPath()
  context.arc(center, center, radius, 0, 2 * Math.PI)
  context.fillStyle = 'rgba(255, 255, 255, 1)'
  context.fill()
  return new THREE.CanvasTexture(canvas)
}

export default class Points extends Layer<PointSpec> {
  private static texture = getTexture()

  protected makeSpecs(particles: Particle3[]): PointSpec[] {
    return map(particles, particle => ({
      position: particle.position,
    }))
  }

  protected makeObject(): THREE.Object3D {
    const geometry = new THREE.BufferGeometry()
    geometry.setFromPoints([new THREE.Vector3()])
    const material = new THREE.PointsMaterial({
      map: Points.texture,
      transparent: true,
      size: SIZE,
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
