import * as THREE from 'three'

const SEGMENTS = 32

export default class Circle {
  public geometry: THREE.BufferGeometry
  public material: THREE.LineBasicMaterial
  public edges: THREE.EdgesGeometry
  public lines: THREE.LineSegments

  constructor({
    radius = 60,
    position = new THREE.Vector3()
  }: {
    radius?: number,
    position?: THREE.Vector3,
  }) {
    this.geometry = new THREE.CircleBufferGeometry(radius, SEGMENTS)
    this.material = new THREE.LineBasicMaterial({ color: 0xFFFFFF })
    this.edges = new THREE.EdgesGeometry(this.geometry, 1)
    this.lines = new THREE.LineSegments(this.geometry, this.material)
    this.lines.position.x = position.x
    this.lines.position.y = position.y
    this.lines.position.z = position.z
  }
}
