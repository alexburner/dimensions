import { each } from 'lodash'

import { RenderParticle } from 'src/interfaces'

export default abstract class Layer<Spec> {
  protected scene: THREE.Scene
  protected objects: THREE.Object3D[]

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.objects = []
  }

  public update(particles: RenderParticle[]) {
    // 1. Generate fresh list of specs
    const specs = this.makeSpecs(particles)

    // 2. Add/remove objects to match
    const currCount = this.objects.length
    const nextCount = specs.length
    const nextDiff = nextCount - currCount
    if (nextDiff < 0) {
      // Remove extra objects from list & scene
      for (let i = nextCount; i < currCount; i++) {
        const object = this.objects.pop()
        this.scene.remove(object!)
      }
    } else if (nextDiff > 0) {
      // Add missing objects to list & scene
      for (let i = currCount; i < nextCount; i++) {
        const object = this.makeObject()
        this.objects.push(object)
        this.scene.add(object)
      }
    }

    // 3. Update objects to match specs
    this.updateObjects(specs)
  }

  public clear() {
    each(this.objects, object => this.scene.remove(object))
    this.objects = []
  }

  protected abstract makeSpecs(particles: RenderParticle[]): Spec[]

  protected abstract makeObject(): THREE.Object3D

  protected abstract updateObjects(specs: Spec[]): void
}
