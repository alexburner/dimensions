import * as THREE from 'three'

import {
  clearObjList,
  Layer,
  LayerArgs,
  resizeObjList,
} from 'src/drawing/layers'
import Particle3 from 'src/particles/Particle3'
import { NeighborhoodMsg } from 'src/particles/System'

interface ObjectSpec {
  position: THREE.Vector3
  radius: number
}

const OPACITY_MAX = 0.5
const OPACITY_MIN = 0.1
const SEGMENTS = 40
const RINGS = 40

const getOpacity = (count: number): number =>
  Math.max(OPACITY_MIN, Math.min(OPACITY_MAX, 3 / count)) // magic

const makeObjectSpecs = (
  particles: Particle3[],
  neighborhood: NeighborhoodMsg,
): ObjectSpec[] =>
  particles.reduce(
    (memo, particle, i) => {
      neighborhood[i].forEach(neighbor => {
        memo.push({
          position: particle.position,
          radius: neighbor.distance,
        })
      })
      return memo
    },
    [] as ObjectSpec[],
  )

const updateObjects = (specs: ObjectSpec[], objects: THREE.Object3D[]) => {
  const opacity = getOpacity(specs.length)
  specs.forEach((spec, i) => {
    const object = objects[i] as THREE.Mesh
    object.position.x = spec.position.x
    object.position.y = spec.position.y
    object.position.z = spec.position.z
    object.scale.set(spec.radius, spec.radius, spec.radius)
    const material = object.material as THREE.MeshNormalMaterial
    material.opacity = opacity
  })
}

export default class Spheres implements Layer {
  private group: THREE.Group
  private objects: THREE.Object3D[]
  private geometry: THREE.SphereBufferGeometry
  private material: THREE.MeshNormalMaterial

  constructor(group: THREE.Group) {
    this.group = group
    this.objects = []
    this.geometry = new THREE.SphereBufferGeometry(1, SEGMENTS, RINGS)
    this.material = new THREE.MeshNormalMaterial({
      blending: THREE.AdditiveBlending,
      depthTest: false,
      opacity: OPACITY_MAX,
      transparent: true,
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
      createObj: () => new THREE.Mesh(this.geometry, this.material),
    })

    // 3. Update objects to match specs
    updateObjects(specs, this.objects)
  }

  public clear() {
    this.objects = clearObjList(this.group, this.objects)
  }
}
