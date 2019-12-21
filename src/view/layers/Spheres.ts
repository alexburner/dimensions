import * as THREE from 'three'

import Particle3 from 'src/particles/Particle3'
import { NeighborhoodMsg, NeighborMsg } from 'src/particles/System'
import { clearObjList, Layer, LayerArgs, resizeObjList } from 'src/view/Layers'

const OPACITY_MAX = 0.5
const OPACITY_MIN = 0.1
const SEGMENTS = 40
const RINGS = 40

export default class Spheres implements Layer {
  private readonly group: THREE.Group
  private objects: THREE.Object3D[]
  private readonly geometry: THREE.SphereBufferGeometry
  private readonly material: THREE.MeshNormalMaterial

  constructor(group: THREE.Group) {
    this.group = group
    this.objects = []
    this.geometry = new THREE.SphereBufferGeometry(1, SEGMENTS, RINGS)
    this.material = new THREE.MeshNormalMaterial({
      blending: THREE.AdditiveBlending,
      depthTest: false,
      opacity: OPACITY_MAX,
      transparent: true,
    })
  }

  public update({ particles, neighborhood }: LayerArgs): void {
    // 1. Generate fresh list of specs
    const specs = makeSphereSpecs(particles, neighborhood)

    // 2. Resize object list for new spec count
    this.objects = resizeObjList({
      group: this.group,
      currList: this.objects,
      newSize: specs.length,
      createObj: (): THREE.Mesh => new THREE.Mesh(this.geometry, this.material),
    })

    // 3. Update objects to match specs
    updateSpheres(specs, this.objects)
  }

  public clear(): void {
    this.objects = clearObjList(this.group, this.objects)
  }
}

interface SphereSpec {
  position: THREE.Vector3
  radius: number
}

const makeSphereSpecs = (
  particles: Particle3[],
  neighborhood: NeighborhoodMsg,
): SphereSpec[] =>
  particles.reduce((memo: SphereSpec[], particle: Particle3, i: number) => {
    neighborhood.neighbors[i].forEach((neighbor: NeighborMsg) => {
      memo.push({
        position: particle.position,
        radius: neighbor.distance,
      })
    })
    return memo
  }, [])

const updateSpheres = (
  specs: SphereSpec[],
  objects: THREE.Object3D[],
): void => {
  const opacity = getOpacity(specs.length)
  specs.forEach((spec: SphereSpec, i: number) => {
    const object = objects[i] as THREE.Mesh
    object.position.x = spec.position.x
    object.position.y = spec.position.y
    object.position.z = spec.position.z
    object.scale.set(spec.radius, spec.radius, spec.radius)
    const material = object.material as THREE.MeshNormalMaterial
    material.opacity = opacity
  })
}

const getOpacity = (count: number): number =>
  Math.max(OPACITY_MIN, Math.min(OPACITY_MAX, 3 / count)) // magic
