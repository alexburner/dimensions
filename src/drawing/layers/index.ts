import THREE from 'three'

import Particle3 from 'src/particles/Particle3'
import { NeighborhoodMsg } from 'src/particles/System'

export interface LayerArgs {
  dimensions: number
  particles: Particle3[]
  neighborhood: NeighborhoodMsg
}

export interface Layer {
  update: (args: LayerArgs) => void
  clear: () => void
}

export type LayerName =
  | 'points'
  | 'lines'
  | 'circles'
  | 'spheres'
  | 'bounds'
  | 'grid'
  | 'trails'
  | 'timeTrails'

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
  group,
  currList,
  newSize,
  createObj,
}: {
  group: THREE.Group
  currList: T[]
  newSize: number
  createObj: () => T
}): T[] =>
  resizeList({
    currList,
    newSize,
    createEl: (): T => {
      const obj = createObj()
      group.add(obj)
      return obj
    },
    destroyEl: (obj: T) => group.remove(obj),
  })

/**
 * Clear a layer's object list
 */
export const clearObjList = <T extends THREE.Object3D>(
  group: THREE.Group,
  list: T[],
): T[] => {
  list.forEach(object => group.remove(object))
  return []
}
