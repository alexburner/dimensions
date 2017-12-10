import { each } from 'lodash'
import THREE from 'three'

import { Particle3 } from 'src/geometry/particles'
import { resizeList } from 'src/util'

export interface Layer {
  update: (particles: Particle3[], dimensions: number) => void
  clear: () => void
}

export type LayerName = 'grid' | 'points' | 'lines' | 'circles' | 'spheres'

export type LayerEnabled = { [name in LayerName]: boolean }

export const resizeObjList = <T extends THREE.Object3D>({
  scene,
  currList,
  newSize,
  createObj,
}: {
  scene: THREE.Scene
  currList: T[]
  newSize: number
  createObj: () => T
}): T[] =>
  resizeList({
    currList,
    newSize,
    createEl: (): T => {
      const obj = createObj()
      scene.add(obj)
      return obj
    },
    destroyEl: (obj: T) => scene.remove(obj),
  })

export const clearObjList = <T extends THREE.Object3D>(
  scene: THREE.Scene,
  list: T[],
): T[] => {
  each(list, object => scene.remove(object))
  return []
}
