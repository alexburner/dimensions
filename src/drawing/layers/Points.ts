import * as THREE from 'three'

import {
  clearObjList,
  Layer,
  LayerArgs,
  resizeObjList,
} from 'src/drawing/layers'
import Particle3 from 'src/particles/Particle3'

interface ObjectSpec {
  position: THREE.Vector3
}

export default class Points implements Layer {
  private scene: THREE.Scene
  private objects: THREE.Object3D[]

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.objects = []
  }

  public update({ particles }: LayerArgs) {
    // 1. Generate fresh list of specs
    const specs = makeSpecs(particles)

    // 2. Resize object list for new spec count
    this.objects = resizeObjList({
      scene: this.scene,
      currList: this.objects,
      newSize: specs.length,
      createObj: makeObject,
    })

    // 3. Update objects to match specs
    updateObjects(specs, this.objects)
  }

  public clear() {
    this.objects = clearObjList(this.scene, this.objects)
  }
}

const SIZE = 8

const texture = ((): THREE.Texture => {
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
})()

const makeSpecs = (particles: Particle3[]): ObjectSpec[] =>
  particles.map(particle => ({
    position: particle.position,
  }))

const makeObject = (): THREE.Object3D => {
  const geometry = new THREE.BufferGeometry()
  geometry.setFromPoints([new THREE.Vector3()])
  const material = new THREE.PointsMaterial({
    map: texture,
    transparent: true,
    size: SIZE,
  })
  const point = new THREE.Points(geometry, material)
  return point
}

const updateObjects = (specs: ObjectSpec[], objects: THREE.Object3D[]) =>
  specs.forEach((spec, i) => {
    const object = objects[i]
    object.position.x = spec.position.x
    object.position.y = spec.position.y
    object.position.z = spec.position.z
  })
