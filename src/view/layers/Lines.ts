import * as THREE from 'three'

import { MAX_NEIGHBORS } from 'src/constants'
import Particle3 from 'src/particles/Particle3'
import { NeighborMsg } from 'src/particles/System'
import { Layer, LayerArgs } from 'src/view/Layers'

export default class Lines implements Layer {
  private readonly group: THREE.Group
  private readonly positions: Float32Array
  private readonly posAttr: THREE.BufferAttribute
  private readonly geometry: THREE.BufferGeometry
  private readonly lineSegments: THREE.LineSegments

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

  public update({ particles, neighborhood }: LayerArgs): void {
    let posIndex = 0
    let numConnected = 0
    particles.forEach((particle: Particle3, i: number) => {
      neighborhood.neighbors[i].forEach((neighbor: NeighborMsg) => {
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

  public clear(): void {
    this.geometry.setDrawRange(0, 0)
  }
}
