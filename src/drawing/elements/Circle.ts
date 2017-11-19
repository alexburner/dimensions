import * as THREE from 'three'

const SEGMENTS = 32

export default class Circle {
  public geometry: THREE.BufferGeometry
  public material: THREE.LineBasicMaterial
  public edges: THREE.EdgesGeometry
  public lines: THREE.LineSegments

  constructor({
    radius = 60,
    position = new THREE.Vector3(),
  }: {
    radius?: number
    position?: THREE.Vector3
  }) {
    /**
     * TODO probably need something like
     * https://threejs.org/docs/#api/extras/core/Shape
     * https://www.packtpub.com/mapt/book/all_books/9781782166283/5/ch05lvl1sec29/the-basic-geometries-provided-by-three.js
     */

    this.geometry = new THREE.CircleBufferGeometry(radius, SEGMENTS)
    this.material = new THREE.LineBasicMaterial({ color: 0xffffff })
    this.edges = new THREE.EdgesGeometry(this.geometry, 1)
    this.lines = new THREE.LineSegments(this.geometry, this.material)
    this.lines.position.x = position.x
    this.lines.position.y = position.y
    this.lines.position.z = position.z
  }
}
