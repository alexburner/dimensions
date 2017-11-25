import * as THREE from 'three'

const SEGMENTS = 50
const RINGS = 50

export default class Sphere {
  public object: THREE.Object3D

  constructor({
    radius = 60,
    position = new THREE.Vector3(),
  }: {
    radius?: number
    position?: THREE.Vector3
  }) {
    const geometry = new THREE.SphereGeometry(radius, SEGMENTS, RINGS)

    const material = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 0.88,
      color: 0xffffff,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = position.x
    mesh.position.y = position.y
    mesh.position.z = position.z

    this.object = mesh;
  }
}
