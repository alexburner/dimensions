import { each } from 'lodash'
import * as THREE from 'three'

import { FIELD_SIZE } from 'src/constants'
import Layer from 'src/drawing/layers/Layer'
import { Particle3 } from 'src/geometry/particles'

interface AxisSpec {
  source: THREE.Vector3
  target: THREE.Vector3
}

const SIZE = FIELD_SIZE

const specsByDimension: { [dimension: number]: AxisSpec[] } = {
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

export default class Grid extends Layer<AxisSpec> {
  private prevLength: number = 0

  protected makeSpecs(_p: Particle3[], dimensions: number): AxisSpec[] {
    if (dimensions > 3) dimensions = 3 // XXX human limits
    return specsByDimension[dimensions]
  }

  protected makeObject(): THREE.Object3D {
    const geometry = new THREE.Geometry()
    const source = new THREE.Vector3(0, 0, 0)
    const target = new THREE.Vector3(0, 0, 0)
    geometry.vertices = [source, target]
    const material = new THREE.LineDashedMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      dashSize: 2.5,
      gapSize: 2.5,
    })
    const line = new THREE.Line(geometry, material)
    return line
  }

  protected updateObjects(specs: AxisSpec[]) {
    if (this.prevLength === specs.length) return
    else this.prevLength = specs.length
    each(specs, (spec, i) => {
      const object = this.objects[i] as THREE.Line
      const geometry = object.geometry as THREE.Geometry
      geometry.vertices = [spec.source, spec.target]
      geometry.verticesNeedUpdate = true
      geometry.computeLineDistances()
    })
  }
}
