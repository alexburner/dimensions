import * as THREE from 'three'

export default class Line {
  public object: THREE.Object3D

  constructor({
    radius = 60,
    position = new THREE.Vector3(),
  }: {
    radius?: number
    position?: THREE.Vector3
  }) {
    const pointA = new THREE.Vector3(0, -radius, 0)
    const pointB = new THREE.Vector3(0, radius, 0)

    const geometry = new THREE.BufferGeometry()
    geometry.setFromPoints([pointA, pointB])

    const material = new THREE.LineBasicMaterial({ color: 0xffffff })

    const line = new THREE.Line(geometry, material)
    line.position.x = position.x
    line.position.y = position.y
    line.position.z = position.z

    this.object = line
  }
}
