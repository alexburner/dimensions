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
    const diffCount = nextCount - currCount
    if (diffCount < 0) {
      // Remove extra objects from scene
      for (let i = nextCount - 1; i < currCount; i++) {
        this.scene.remove(this.objects[i])
      }
      // Remove extra objects from list
      this.objects.splice(currCount - 1, diffCount)
    } else if (diffCount > 0) {
      // Add missing objects to scene & list
      for (let i = currCount; i < nextCount; i++) {
        const object = this.makeObject()
        this.scene.add(object)
        this.objects.push(object)
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
