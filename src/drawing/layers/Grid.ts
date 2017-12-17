import * as THREE from 'three'

import { FIELD_SIZE } from 'src/constants'
import { clearObjList, Layer, resizeObjList } from 'src/drawing/layers'
import { Particle3 } from 'src/geometry/particles'

interface ObjectSpec {
  source: THREE.Vector3
  target: THREE.Vector3
}

export default class Grid implements Layer {
  private scene: THREE.Scene
  private objects: THREE.Object3D[]
  private dimensions: number | undefined

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.objects = []
  }

  public update(particles: Particle3[], dimensions: number) {
    if (this.dimensions === dimensions) return
    else this.dimensions = dimensions

    // 1. Generate fresh list of specs
    const specs = makeObjectSpecs(dimensions)

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
    this.dimensions = undefined
  }
}

const SIZE = FIELD_SIZE // reality is FIELD_SIZE / 2

const specsByDimension: { [dimension: number]: ObjectSpec[] } = {
  0: [],
  1: [
    // x axis
    {
      source: new THREE.Vector3(-SIZE, 0, 0),
      target: new THREE.Vector3(SIZE, 0, 0),
    },
  ],
  2: [
    // x axis
    {
      source: new THREE.Vector3(-SIZE, 0, 0),
      target: new THREE.Vector3(SIZE, 0, 0),
    },
    // y axis
    {
      source: new THREE.Vector3(0, -SIZE, 0),
      target: new THREE.Vector3(0, SIZE, 0),
    },
    // square
    {
      source: new THREE.Vector3(SIZE, -SIZE, 0),
      target: new THREE.Vector3(SIZE, SIZE, 0),
    },
    {
      source: new THREE.Vector3(-SIZE, -SIZE, 0),
      target: new THREE.Vector3(-SIZE, SIZE, 0),
    },
    {
      source: new THREE.Vector3(-SIZE, -SIZE, 0),
      target: new THREE.Vector3(SIZE, -SIZE, 0),
    },
    {
      source: new THREE.Vector3(-SIZE, SIZE, 0),
      target: new THREE.Vector3(SIZE, SIZE, 0),
    },
  ],
  3: [
    // x axis
    {
      source: new THREE.Vector3(-SIZE, 0, 0),
      target: new THREE.Vector3(SIZE, 0, 0),
    },
    // y axis
    {
      source: new THREE.Vector3(0, -SIZE, 0),
      target: new THREE.Vector3(0, SIZE, 0),
    },
    // z axis
    {
      source: new THREE.Vector3(0, 0, -SIZE),
      target: new THREE.Vector3(0, 0, SIZE),
    },
    // > cube <
    // bottom square
    {
      source: new THREE.Vector3(SIZE, -SIZE, -SIZE),
      target: new THREE.Vector3(SIZE, SIZE, -SIZE),
    },
    {
      source: new THREE.Vector3(-SIZE, -SIZE, -SIZE),
      target: new THREE.Vector3(-SIZE, SIZE, -SIZE),
    },
    {
      source: new THREE.Vector3(-SIZE, -SIZE, -SIZE),
      target: new THREE.Vector3(SIZE, -SIZE, -SIZE),
    },
    {
      source: new THREE.Vector3(-SIZE, SIZE, -SIZE),
      target: new THREE.Vector3(SIZE, SIZE, -SIZE),
    },
    // top square
    {
      source: new THREE.Vector3(SIZE, -SIZE, SIZE),
      target: new THREE.Vector3(SIZE, SIZE, SIZE),
    },
    {
      source: new THREE.Vector3(-SIZE, -SIZE, SIZE),
      target: new THREE.Vector3(-SIZE, SIZE, SIZE),
    },
    {
      source: new THREE.Vector3(-SIZE, -SIZE, SIZE),
      target: new THREE.Vector3(SIZE, -SIZE, SIZE),
    },
    {
      source: new THREE.Vector3(-SIZE, SIZE, SIZE),
      target: new THREE.Vector3(SIZE, SIZE, SIZE),
    },
    // z poles
    {
      source: new THREE.Vector3(-SIZE, -SIZE, -SIZE),
      target: new THREE.Vector3(-SIZE, -SIZE, SIZE),
    },
    {
      source: new THREE.Vector3(SIZE, SIZE, -SIZE),
      target: new THREE.Vector3(SIZE, SIZE, SIZE),
    },
    {
      source: new THREE.Vector3(SIZE, -SIZE, -SIZE),
      target: new THREE.Vector3(SIZE, -SIZE, SIZE),
    },
    {
      source: new THREE.Vector3(-SIZE, SIZE, -SIZE),
      target: new THREE.Vector3(-SIZE, SIZE, SIZE),
    },
    // xy square
    {
      source: new THREE.Vector3(SIZE, -SIZE, 0),
      target: new THREE.Vector3(SIZE, SIZE, 0),
    },
    {
      source: new THREE.Vector3(-SIZE, -SIZE, 0),
      target: new THREE.Vector3(-SIZE, SIZE, 0),
    },
    {
      source: new THREE.Vector3(-SIZE, -SIZE, 0),
      target: new THREE.Vector3(SIZE, -SIZE, 0),
    },
    {
      source: new THREE.Vector3(-SIZE, SIZE, 0),
      target: new THREE.Vector3(SIZE, SIZE, 0),
    },
    // xz square
    {
      source: new THREE.Vector3(SIZE, 0, -SIZE),
      target: new THREE.Vector3(SIZE, 0, SIZE),
    },
    {
      source: new THREE.Vector3(-SIZE, 0, -SIZE),
      target: new THREE.Vector3(-SIZE, 0, SIZE),
    },
    {
      source: new THREE.Vector3(-SIZE, 0, -SIZE),
      target: new THREE.Vector3(SIZE, 0, -SIZE),
    },
    {
      source: new THREE.Vector3(-SIZE, 0, SIZE),
      target: new THREE.Vector3(SIZE, 0, SIZE),
    },
    // yz square
    {
      source: new THREE.Vector3(0, SIZE, -SIZE),
      target: new THREE.Vector3(0, SIZE, SIZE),
    },
    {
      source: new THREE.Vector3(0, -SIZE, -SIZE),
      target: new THREE.Vector3(0, -SIZE, SIZE),
    },
    {
      source: new THREE.Vector3(0, -SIZE, -SIZE),
      target: new THREE.Vector3(0, SIZE, -SIZE),
    },
    {
      source: new THREE.Vector3(0, -SIZE, SIZE),
      target: new THREE.Vector3(0, SIZE, SIZE),
    },
  ],
}

const makeObjectSpecs = (dimensions: number): ObjectSpec[] => {
  if (dimensions > 3) dimensions = 3 // XXX human limits
  return specsByDimension[dimensions]
}

const makeObject = (): THREE.Object3D => {
  const geometry = new THREE.Geometry()
  const source = new THREE.Vector3(0, 0, 0)
  const target = new THREE.Vector3(0, 0, 0)
  geometry.vertices = [source, target]
  const material = new THREE.LineDashedMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
    dashSize: 1.25,
    gapSize: 1.25,
  })
  const line = new THREE.Line(geometry, material)
  return line
}

const updateObjects = (specs: ObjectSpec[], objects: THREE.Object3D[]) =>
  specs.forEach((spec, i) => {
    const object = objects[i] as THREE.Line
    const geometry = object.geometry as THREE.Geometry
    geometry.vertices = [spec.source, spec.target]
    geometry.verticesNeedUpdate = true
    geometry.computeLineDistances()
  })
