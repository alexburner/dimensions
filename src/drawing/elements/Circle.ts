import * as THREE from 'three'

export default class Circle {
  public object: THREE.Object3D

  constructor({
    radius = 60,
    position = new THREE.Vector3(),
  }: {
    radius?: number
    position?: THREE.Vector3
  }) {
    const shape = new THREE.Shape()
    shape.arc(0, 0, radius, 0, 2 * Math.PI, false)
    shape.autoClose = true

    const points2 = shape.getSpacedPoints()
    const points3 = points2.map(p => new THREE.Vector3(p.x, p.y, 0))

    const geometry = new THREE.BufferGeometry()
    geometry.setFromPoints(points3)

    const material = new THREE.LineBasicMaterial({ color: 0xffffff })

    const line = new THREE.Line(geometry, material)
    line.position.x = position.x
    line.position.y = position.y
    line.position.z = position.z

    this.object = line
  }
}
