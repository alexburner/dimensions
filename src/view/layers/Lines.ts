import * as THREE from 'three'

import { MAX_NEIGHBORS } from 'src/constants'
import Particle3 from 'src/particles/Particle3'
import { NeighborMsg } from 'src/particles/System'
import { Layer, LayerArgs } from 'src/view/Layers'

const POINT_COUNT = MAX_NEIGHBORS * 3
const OPACITY = 0.6

export default class Lines implements Layer {
  private readonly geometry: THREE.BufferGeometry
  private readonly lineSegments: THREE.LineSegments

  private readonly positions: Float32Array
  private readonly posAttr: THREE.BufferAttribute

  private readonly alphas: Float32Array
  private readonly alphaAttr: THREE.BufferAttribute

  constructor(group: THREE.Group) {
    this.geometry = new THREE.BufferGeometry()

    this.positions = new Float32Array(POINT_COUNT)
    this.posAttr = new THREE.BufferAttribute(this.positions, 3).setDynamic(true)
    this.geometry.addAttribute('position', this.posAttr)

    this.alphas = new Float32Array(POINT_COUNT * 2) // 2 for each segment's points
    this.alphas.fill(OPACITY) // begin at default opacity
    this.alphaAttr = new THREE.BufferAttribute(this.alphas, 1).setDynamic(true)
    this.geometry.addAttribute('alpha', this.alphaAttr)

    this.geometry.computeBoundingSphere()
    this.geometry.setDrawRange(0, 0)

    this.lineSegments = new THREE.LineSegments(
      this.geometry,
      new THREE.ShaderMaterial({
        uniforms: { color: { value: new THREE.Color(0xffffff) } },
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
      }),
    )
    group.add(this.lineSegments)
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

    const drawRange = numConnected * 2
    this.geometry.setDrawRange(0, drawRange)

    if (neighborhood.type === 'proximity') {
      // set each line to fade based on length
      // TODO
    } else {
      // set all lines to default opacity
      this.alphas.fill(OPACITY, 0, drawRange)
    }

    this.posAttr.needsUpdate = true
    this.alphaAttr.needsUpdate = true
  }

  public clear(): void {
    this.geometry.setDrawRange(0, 0)
  }
}

const vertexShader = `
  attribute float alpha;
  varying float vAlpha;

  void main() {
    vAlpha = alpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`

const fragmentShader = `
  uniform vec3 color;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4( color, vAlpha );
  }
`
