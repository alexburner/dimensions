import * as THREE from 'three'

import { clearObjList, Layer, resizeObjList } from 'src/drawing/layers'
import Particle3 from 'src/particles/Particle3'

interface ObjectSpec {
  position: THREE.Vector3
  radius: number
}

export default class Spheres implements Layer {
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

const OPACITY_MAX = 0.5
const OPACITY_MIN = 0.2
const SEGMENTS = 40
const RINGS = 40

const getOpacity = (count: number): number =>
  Math.max(OPACITY_MIN, Math.min(OPACITY_MAX, 3 / count)) // magic

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
  const geometry = new THREE.SphereBufferGeometry(1, SEGMENTS, RINGS)
  const material = new THREE.MeshNormalMaterial({
    blending: THREE.AdditiveBlending,
    depthTest: false,
    opacity: OPACITY_MAX,
    transparent: true,
  })
  const mesh = new THREE.Mesh(geometry, material)
  return mesh
}

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
