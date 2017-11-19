import * as THREE from 'three'

const SEGMENTS = 50
const RINGS = 50

export default class Sphere {
  public geometry: THREE.Geometry
  public material: THREE.Material
  public mesh: THREE.Mesh

  constructor({
    radius = 60,
    position = new THREE.Vector3(),
  }: {
    radius?: number
    position?: THREE.Vector3
  }) {
    this.geometry = new THREE.SphereGeometry(radius, SEGMENTS, RINGS)
    this.material = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 0.88,
      color: 0xffffff,
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.x = position.x
    this.mesh.position.y = position.y
    this.mesh.position.z = position.z
  }
}
