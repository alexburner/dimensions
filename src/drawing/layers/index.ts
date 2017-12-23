import THREE from 'three'

import { Particle3 } from 'src/geometry/particles'

export interface Layer {
  update: (particles: Particle3[], dimensions: number) => void
  clear: () => void
}

export type LayerName = 'grid' | 'points' | 'lines' | 'circles' | 'spheres'

/**
 * Resize a generic list, creating or destroying elements as needed
 */
const resizeList = <T>({
  currList,
  newSize,
  createEl,
  destroyEl,
}: {
  currList: T[]
  newSize: number
  createEl: () => T
  destroyEl: (el: T) => void
}): T[] => {
  const newList = [...currList]
  const currSize = currList.length
  const sizeDelta = newSize - currSize
  if (sizeDelta < 0) {
    // Remove elements to fit
    for (let i = newSize; i < currSize; i++) {
      const el = newList.pop()
      destroyEl(el!)
    }
  } else if (sizeDelta > 0) {
    // Add elements to fit
    for (let i = currSize; i < newSize; i++) {
      const el = createEl()
      newList.push(el)
    }
  }
  return newList
}

/**
 * Resize a layer's object list
 */
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

/**
 * Clear a layer's object list
 */
export const clearObjList = <T extends THREE.Object3D>(
  scene: THREE.Scene,
  list: T[],
): T[] => {
  list.forEach(object => scene.remove(object))
  return []
}
