import THREE from 'three'

import { RenderOptions, WorkerResponse } from 'src/options'
import Particle3 from 'src/particles/Particle3'
import { NeighborhoodMsg } from 'src/particles/System'
import Bounds from 'src/view/layers/Bounds'
import Circles from 'src/view/layers/Circles'
import Grid from 'src/view/layers/Grid'
import Lines from 'src/view/layers/Lines'
import Points from 'src/view/layers/Points'
import Spheres from 'src/view/layers/Spheres'
import TimeTrails from 'src/view/layers/TimeTrails'
import Trails from 'src/view/layers/Trails'

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

export default class Layers {
  private layers: { [name in LayerName]: Layer }
  private layerNames: LayerName[]

  constructor(group: THREE.Group, camera: THREE.Camera) {
    this.layers = {
      points: new Points(group),
      lines: new Lines(group),
      circles: new Circles(group),
      spheres: new Spheres(group),
      bounds: new Bounds(group, camera),
      grid: new Grid(group),
      trails: new Trails(group),
      timeTrails: new TimeTrails(group),
    }
    this.layerNames = Object.keys(this.layers) as LayerName[]
  }

  public update(
    { layers }: RenderOptions,
    { dimensions, neighborhood, particles }: WorkerResponse,
  ) {
    const particles3 = particles.map(p => new Particle3(p))
    this.layerNames.forEach(layerName => {
      const layer = this.layers[layerName]
      const layerVisible = layers[layerName]
      layerVisible
        ? layer.update({ particles: particles3, dimensions, neighborhood })
        : layer.clear()
    })
  }
}

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
