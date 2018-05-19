import * as THREE from 'three'

import { MAX_NEIGHBORS } from 'src/constants'
import { Layer, LayerArgs } from 'src/view/Layers'

export default class Lines implements Layer {
  private group: THREE.Group
  private positions: Float32Array
  private posAttr: THREE.BufferAttribute
  private geometry: THREE.BufferGeometry
  private lineSegments: THREE.LineSegments

  constructor(group: THREE.Group) {
    this.group = group
    this.positions = new Float32Array(MAX_NEIGHBORS * 3)
    this.posAttr = new THREE.BufferAttribute(this.positions, 3).setDynamic(true)
    this.geometry = new THREE.BufferGeometry()
    this.geometry.addAttribute('position', this.posAttr)
    this.geometry.computeBoundingSphere()
    this.geometry.setDrawRange(0, 0)
    this.lineSegments = new THREE.LineSegments(
      this.geometry,
      new THREE.LineBasicMaterial({
        blending: THREE.AdditiveBlending,
        transparent: true,
        color: 0xffffff,
        opacity: 0.6,
      }),
    )
    this.group.add(this.lineSegments)
  }

  public update({ particles, neighborhood }: LayerArgs) {
    let posIndex = 0
    let numConnected = 0
    particles.forEach((particle, i) => {
      neighborhood[i].forEach(neighbor => {
        const other = particles[neighbor.index]
        this.positions[posIndex++] = particle.position.x
        this.positions[posIndex++] = particle.position.y
        this.positions[posIndex++] = particle.position.z
        this.positions[posIndex++] = other.position.x
        this.positions[posIndex++] = other.position.y
        this.positions[posIndex++] = other.position.z
        numConnected++
      })
    })

    this.geometry.setDrawRange(0, numConnected * 2)
    this.posAttr.needsUpdate = true
  }

  public clear() {
    this.geometry.setDrawRange(0, 0)
  }
}
