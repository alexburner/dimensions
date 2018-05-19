import * as THREE from 'three'

import Particle3, { toVector3 } from 'src/particles/Particle3'
import { NeighborhoodMsg } from 'src/particles/System'
import { clearObjList, Layer, LayerArgs, resizeObjList } from 'src/view/Layers'

interface ObjectSpec {
  delta: THREE.Vector3
  position: THREE.Vector3
  radius: number
}

const DIVISIONS = 64
const AXIS = new THREE.Vector3(0, 1, 0)

const makeObjectSpecs = (
  particles: Particle3[],
  neighborhood: NeighborhoodMsg,
): ObjectSpec[] =>
  particles.reduce(
    (memo, particle, i) => {
      neighborhood[i].forEach(neighbor => {
        memo.push({
          delta: toVector3(neighbor.delta),
          position: particle.position,
          radius: neighbor.distance,
        })
      })
      return memo
    },
    [] as ObjectSpec[],
  )

const updateObjects = (specs: ObjectSpec[], objects: THREE.Object3D[]) =>
  specs.forEach((spec, i) => {
    const object = objects[i]
    object.position.x = spec.position.x
    object.position.y = spec.position.y
    object.position.z = spec.position.z
    object.scale.set(spec.radius, spec.radius, spec.radius)
    // Rotate circle to align with delta vector
    // via https://stackoverflow.com/a/31987883/3717556
    object.quaternion.setFromUnitVectors(AXIS, spec.delta.clone().normalize())
  })

export default class Circles implements Layer {
  private group: THREE.Group
  private objects: THREE.Object3D[]
  private geometry: THREE.BufferGeometry
  private material: THREE.LineBasicMaterial

  constructor(group: THREE.Group) {
    this.group = group
    this.objects = []
    const shape = new THREE.Shape()
    shape.arc(0, 0, 1, 0, 2 * Math.PI, false)
    shape.autoClose = true
    const points2 = shape.getSpacedPoints(DIVISIONS)
    const points3 = points2.map(p => new THREE.Vector3(p.x, p.y, 0))
    this.geometry = new THREE.BufferGeometry()
    this.geometry.setFromPoints(points3)
    this.material = new THREE.LineBasicMaterial({
      blending: THREE.AdditiveBlending,
      transparent: true,
      color: 0xffffff,
      opacity: 0.6,
    })
  }

  public update({ particles, neighborhood }: LayerArgs) {
    // 1. Generate fresh list of specs
    const specs = makeObjectSpecs(particles, neighborhood)

    // 2. Resize object list for new spec count
    this.objects = resizeObjList({
      group: this.group,
      currList: this.objects,
      newSize: specs.length,
      createObj: () => new THREE.Line(this.geometry, this.material),
    })

    // 3. Update objects to match specs
    updateObjects(specs, this.objects)
  }

  public clear() {
    this.objects = clearObjList(this.group, this.objects)
  }
}
