import * as THREE from 'three'

import { clearObjList, Layer, resizeObjList } from 'src/drawing/layers'
import Particle3 from 'src/particles/Particle3'

interface ObjectSpec {
  position: THREE.Vector3
  radius: number
}

export default class Circles implements Layer {
  private scene: THREE.Scene
  private objects: THREE.Object3D[]

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.objects = []
  }

  public update(particles: Particle3[]) {
    // 1. Generate fresh list of specs
    const specs = makeObjectSpecs(particles)

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

const DIVISIONS = 64

const makeObjectSpecs = (particles: Particle3[]): ObjectSpec[] =>
  particles.reduce(
    (memo, particle) => {
      particle.neighbors.forEach(neighbor => {
        memo.push({
          position: particle.position,
          radius: neighbor.distance,
        })
      })
      return memo
    },
    [] as ObjectSpec[],
  )

const makeObject = (): THREE.Object3D => {
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

const updateObjects = (specs: ObjectSpec[], objects: THREE.Object3D[]) =>
  specs.forEach((spec, i) => {
    const object = objects[i]
    object.position.x = spec.position.x
    object.position.y = spec.position.y
    object.position.z = spec.position.z
    object.scale.set(spec.radius, spec.radius, spec.radius)
  })
