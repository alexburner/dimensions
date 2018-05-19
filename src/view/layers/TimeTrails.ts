import * as THREE from 'three'

import Particle3 from 'src/particles/Particle3'
import { RecentQueue } from 'src/util'
import { Layer, LayerArgs } from 'src/view/Layers'

const TRAIL_GAP = 1 / 2
const TRAIL_LENGTH = 2000
const MAX_COUNT = TRAIL_LENGTH * 1000
const DOT_SIZE = 1

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

export default class TimeTrails implements Layer {
  private group: THREE.Group
  private positions: Float32Array
  private posAttr: THREE.BufferAttribute
  private geometry: THREE.BufferGeometry
  private pointCloud: THREE.Points
  private particleQueues: RecentQueue<Particle3>[]
  private drawCount = 0

  constructor(group: THREE.Group) {
    this.group = group
    this.positions = new Float32Array(MAX_COUNT * 3)
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
        size: DOT_SIZE,
      }),
    )
    this.group.add(this.pointCloud)
    this.particleQueues = []
    this.drawCount = 0
  }

  public update({ particles }: LayerArgs) {
    this.particleQueues.forEach(particleQueue => {
      particleQueue.values().forEach(particle => {
        particle.position.z -= TRAIL_GAP
      })
    })

    while (this.particleQueues.length < particles.length) {
      this.particleQueues.push(new RecentQueue<Particle3>(TRAIL_LENGTH))
    }
    while (this.particleQueues.length > particles.length) {
      this.particleQueues.pop()
    }

    this.particleQueues.forEach((particleQueue, i) => {
      particleQueue.add(particles[i].clone())
    })

    this.drawCount = 0
    this.particleQueues.forEach(particleQueue => {
      particleQueue.values().forEach(particle => {
        this.positions[this.drawCount * 3 + 0] = particle.position.x
        this.positions[this.drawCount * 3 + 1] = particle.position.y
        this.positions[this.drawCount * 3 + 2] = particle.position.z
        this.drawCount++
      })
    })

    this.geometry.setDrawRange(0, this.drawCount)
    this.posAttr.needsUpdate = true
  }

  public clear() {
    this.geometry.setDrawRange(0, 0)
    this.particleQueues = []
    this.drawCount = 0
  }
}
