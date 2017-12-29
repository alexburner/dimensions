import * as THREE from 'three'

import { FIELD_SIZE } from 'src/constants'
import {
  clearObjList,
  Layer,
  LayerArgs,
  resizeObjList,
} from 'src/drawing/layers'

type ObjectSpec = [number, number, number] // [x, y, z]

export default class Grid implements Layer {
  private group: THREE.Group
  private objects: THREE.Object3D[]

  constructor(group: THREE.Group) {
    this.group = group
    this.objects = []
  }

  public update({ dimensions }: LayerArgs) {
    // 1. Generate fresh list of specs
    const specs = makeObjectSpecs(dimensions)

    // 2. Resize object list for new spec count
    this.objects = resizeObjList({
      group: this.group,
      currList: this.objects,
      newSize: specs.length,
      createObj: makeObject,
    })

    // 3. Update objects to match specs
    updateObjects(specs, this.objects)
  }

  public clear() {
    this.objects = clearObjList(this.group, this.objects)
  }
}

const SIZE = FIELD_SIZE // reality is FIELD_SIZE / 2

const SPECS: ObjectSpec[][] = [
  [],
  [
    // x axis
    [-SIZE, 0, 0],
    [SIZE, 0, 0],
  ],
  [
    // x axis
    [-SIZE, 0, 0],
    [SIZE, 0, 0],
    // y axis
    [0, -SIZE, 0],
    [0, SIZE, 0],
    // square
    [SIZE, -SIZE, 0],
    [SIZE, SIZE, 0],
    [-SIZE, -SIZE, 0],
    [-SIZE, SIZE, 0],
    [-SIZE, -SIZE, 0],
    [SIZE, -SIZE, 0],
    [-SIZE, SIZE, 0],
    [SIZE, SIZE, 0],
  ],
  [
    // x axis
    [-SIZE, 0, 0],
    [SIZE, 0, 0],
    // y axis
    [0, -SIZE, 0],
    [0, SIZE, 0],
    // z axis
    [0, 0, -SIZE],
    [0, 0, SIZE],
    // > cube <
    // bottom square
    [SIZE, -SIZE, -SIZE],
    [SIZE, SIZE, -SIZE],
    [-SIZE, -SIZE, -SIZE],
    [-SIZE, SIZE, -SIZE],
    [-SIZE, -SIZE, -SIZE],
    [SIZE, -SIZE, -SIZE],
    [-SIZE, SIZE, -SIZE],
    [SIZE, SIZE, -SIZE],
    // top square
    [SIZE, -SIZE, SIZE],
    [SIZE, SIZE, SIZE],
    [-SIZE, -SIZE, SIZE],
    [-SIZE, SIZE, SIZE],
    [-SIZE, -SIZE, SIZE],
    [SIZE, -SIZE, SIZE],
    [-SIZE, SIZE, SIZE],
    [SIZE, SIZE, SIZE],
    // z poles
    [-SIZE, -SIZE, -SIZE],
    [-SIZE, -SIZE, SIZE],
    [SIZE, SIZE, -SIZE],
    [SIZE, SIZE, SIZE],
    [SIZE, -SIZE, -SIZE],
    [SIZE, -SIZE, SIZE],
    [-SIZE, SIZE, -SIZE],
    [-SIZE, SIZE, SIZE],
    // xy square
    [SIZE, -SIZE, 0],
    [SIZE, SIZE, 0],
    [-SIZE, -SIZE, 0],
    [-SIZE, SIZE, 0],
    [-SIZE, -SIZE, 0],
    [SIZE, -SIZE, 0],
    [-SIZE, SIZE, 0],
    [SIZE, SIZE, 0],
    // xz square
    [SIZE, 0, -SIZE],
    [SIZE, 0, SIZE],
    [-SIZE, 0, -SIZE],
    [-SIZE, 0, SIZE],
    [-SIZE, 0, -SIZE],
    [SIZE, 0, -SIZE],
    [-SIZE, 0, SIZE],
    [SIZE, 0, SIZE],
    // yz square
    [0, SIZE, -SIZE],
    [0, SIZE, SIZE],
    [0, -SIZE, -SIZE],
    [0, -SIZE, SIZE],
    [0, -SIZE, -SIZE],
    [0, SIZE, -SIZE],
    [0, -SIZE, SIZE],
    [0, SIZE, SIZE],
  ],
]

const makeObjectSpecs = (dimensions: number): ObjectSpec[] => {
  if (dimensions > 3) dimensions = 3 // XXX human limits
  return SPECS[dimensions]
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
    if (i % 2) return // only do evens, each pair
    const source = new THREE.Vector3(...specs[i])
    const target = new THREE.Vector3(...specs[i + 1])
    const object = objects[i] as THREE.Line
    const geometry = object.geometry as THREE.Geometry
    geometry.vertices = [source, target]
    geometry.verticesNeedUpdate = true
    geometry.computeLineDistances()
  })
