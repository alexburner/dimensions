import * as THREE from 'three'

import { MAX_PARTICLES } from 'src/constants'
import Particle3 from 'src/particles/Particle3'
import { Layer, LayerArgs } from 'src/view/Layers'

const SIZE = 4

const texture = ((): THREE.Texture => {
  const size = 256
  const padding = 4
  const radius = size / 2 - padding
  const center = size / 2
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Failed to get 2d canvas context')
  context.beginPath()
  context.arc(center, center, radius, 0, 2 * Math.PI)
  context.fillStyle = 'rgba(255, 255, 255, 1)'
  context.fill()
  return new THREE.CanvasTexture(canvas)
})()

export default class Points implements Layer {
  private readonly group: THREE.Group
  private readonly positions: Float32Array
  private readonly posAttr: THREE.BufferAttribute
  private readonly geometry: THREE.BufferGeometry
  private readonly pointCloud: THREE.Points

  constructor(group: THREE.Group) {
    this.group = group
    this.positions = new Float32Array(MAX_PARTICLES * 3)
    this.posAttr = new THREE.BufferAttribute(this.positions, 3).setDynamic(true)
    this.geometry = new THREE.BufferGeometry()
    this.geometry.addAttribute('position', this.posAttr)
    this.geometry.setDrawRange(0, 0)
    this.pointCloud = new THREE.Points(
      this.geometry,
      new THREE.PointsMaterial({
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        opacity: 0.9,
        map: texture,
        size: SIZE,
      }),
    )
    this.group.add(this.pointCloud)
  }

  public update({ particles }: LayerArgs): void {
    particles.forEach((particle: Particle3, i: number) => {
      this.positions[i * 3 + 0] = particle.position.x
      this.positions[i * 3 + 1] = particle.position.y
      this.positions[i * 3 + 2] = particle.position.z
    })

    this.geometry.setDrawRange(0, particles.length)
    this.posAttr.needsUpdate = true
  }

  public clear(): void {
    this.geometry.setDrawRange(0, 0)
  }
}
