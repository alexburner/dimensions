import * as THREE from 'three'

import { MAX_RADIUS } from 'src/constants'
import { Layer, LayerArgs } from 'src/drawing/layers'

const COLOR = 0xffffff
const OPACITY = 0.5

export default class Bounds implements Layer {
  private dimensions: number
  private group: THREE.Group
  private line: THREE.Object3D
  private circle: THREE.Object3D
  private sphere: THREE.Object3D

  constructor(group: THREE.Group, camera: THREE.Camera) {
    this.dimensions = -1
    this.group = group
    this.line = makeLine()
    this.circle = makeCircle()
    this.sphere = makeSphere(camera)
  }

  public update({ dimensions }: LayerArgs) {
    if (this.dimensions === dimensions) return
    else this.dimensions = dimensions
    this.clear()
    switch (dimensions) {
      case 1:
        this.group.add(this.line)
        break
      case 2:
        this.group.add(this.circle)
        break
      case 3:
        this.group.add(this.sphere)
        break
    }
  }

  public clear() {
    this.group.remove(this.line)
    this.group.remove(this.circle)
    this.group.remove(this.sphere)
    this.dimensions = -1
  }
}

const makeLine = (): THREE.Object3D => {
  const positions = new Float32Array(6).fill(0)
  positions[0] = -MAX_RADIUS // source x
  positions[3] = MAX_RADIUS // target x
  const geometry = new THREE.BufferGeometry()
  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.computeBoundingSphere()
  return new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({
      blending: THREE.AdditiveBlending,
      transparent: true,
      color: COLOR,
      opacity: OPACITY,
    }),
  )
}

const DIVISIONS = 64
const makeCircle = (): THREE.Object3D => {
  const shape = new THREE.Shape()
  shape.arc(0, 0, MAX_RADIUS, 0, 2 * Math.PI, false)
  shape.autoClose = true
  const points2 = shape.getSpacedPoints(DIVISIONS)
  const points3 = points2.map(p => new THREE.Vector3(p.x, p.y, 0))
  const geometry = new THREE.BufferGeometry()
  geometry.setFromPoints(points3)
  const material = new THREE.LineBasicMaterial({
    blending: THREE.AdditiveBlending,
    transparent: true,
    color: COLOR,
    opacity: OPACITY,
  })
  return new THREE.Line(geometry, material)
}

const SEGMENTS = 32
const RINGS = 32
const makeSphere = (camera: THREE.Camera): THREE.Object3D => {
  return new THREE.Mesh(
    new THREE.SphereBufferGeometry(MAX_RADIUS, SEGMENTS, RINGS),
    new THREE.ShaderMaterial({
      uniforms: {
        c: {
          type: 'f',
          value: 1.0,
        },
        p: {
          type: 'f',
          value: 1.4,
        },
        glowColor: {
          type: 'c',
          value: new THREE.Color(0xffffff),
        },
        viewVector: {
          type: 'v3',
          value: camera.position,
        },
      },
      vertexShader: bubbleShaders.vertex,
      fragmentShader: bubbleShaders.fragment,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    }),
  )
}

const bubbleShaders = {
  vertex: `
    uniform vec3 viewVector;
    uniform float c;
    uniform float p;
    varying float intensity;
    void main()
    {
        vec3 vNormal = normalize( normalMatrix * normal );
      vec3 vNormel = normalize( normalMatrix * viewVector );
      intensity = pow( c - dot(vNormal, vNormel), p );

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragment: `
    uniform vec3 glowColor;
    varying float intensity;
    void main()
    {
      vec3 glow = glowColor * intensity;
        gl_FragColor = vec4( glow, 1.0 );
    }
  `,
}
