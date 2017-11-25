import * as THREE from 'three'

const getTexture = (): THREE.Texture => {
  const SIZE = 256
  const PAD = 4
  const radius = SIZE / 2 - PAD
  const center = SIZE / 2
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const context = canvas.getContext('2d')
  context!.beginPath()
  context!.arc(center, center, radius, 0, 2 * Math.PI)
  context!.fillStyle = 'rgba(255, 255, 255, 1)'
  context!.fill()
  return new THREE.CanvasTexture(canvas)
}

export default class Point {
  private static texture = getTexture()
  public object: THREE.Object3D

  constructor({
    position = new THREE.Vector3(),
  }: {
    position?: THREE.Vector3
  }) {
    const geometry = new THREE.BufferGeometry()
    geometry.setFromPoints([new THREE.Vector3()])

    const material = new THREE.PointsMaterial({
      map: Point.texture,
      transparent: true,
      size: 20,
    })

    const point = new THREE.Points(geometry, material)
    point.position.x = position.x
    point.position.y = position.y
    point.position.z = position.z

    this.object = point
  }
}
