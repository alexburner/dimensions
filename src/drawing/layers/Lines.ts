import * as THREE from 'three'

import { clearObjList, Layer, resizeObjList } from 'src/drawing/layers'
import Particle3 from 'src/particles/Particle3'

interface ObjectSpec {
  source: THREE.Vector3
  target: THREE.Vector3
}

export default class Lines implements Layer {
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

const makeObjectSpecs = (particles: Particle3[]): ObjectSpec[] =>
  particles.reduce(
    (memo, particle) => {
      particle.neighbors.forEach(neighbor => {
        memo.push({
          source: particle.position,
          target: particles[neighbor.index].position,
        })
      })
      return memo
    },
    [] as ObjectSpec[],
  )

const makeObject = (): THREE.Object3D => {
  const geometry = new THREE.BufferGeometry()
  const source = new THREE.Vector3(0, 0, 0)
  const target = new THREE.Vector3(0, 0, 0)
  geometry.setFromPoints([source, target])
  const material = new THREE.LineBasicMaterial({ color: 0xffffff })
  const line = new THREE.Line(geometry, material)
  return line
}

const updateObjects = (specs: ObjectSpec[], objects: THREE.Object3D[]) =>
  specs.forEach((spec, i) => {
    const object = objects[i] as THREE.Line
    const geometry = object.geometry as THREE.BufferGeometry
    geometry.setFromPoints([spec.source, spec.target])
  })
