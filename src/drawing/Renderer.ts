import { each, map } from 'lodash'
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'

import { Layer, LayerName } from 'src/drawing/layers'
import Circles from 'src/drawing/layers/Circles'
import Grid from 'src/drawing/layers/Grid'
import Lines from 'src/drawing/layers/Lines'
import Points from 'src/drawing/layers/Points'
import Spheres from 'src/drawing/layers/Spheres'
import { toParticle3 } from 'src/geometry/particles'
import { WorkerResponse } from 'src/worker'

const NEAR = 1
const FAR = 5000
const VIEWANGLE = 45

export default class Renderer {
  private isDestroyed: boolean = false
  private rafId: number
  private canvas: HTMLCanvasElement
  private renderer: THREE.Renderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: TrackballControls
  private layers: { [name in LayerName]: Layer }

  constructor({
    canvas,
    bounds,
  }: {
    canvas: HTMLCanvasElement
    bounds: ClientRect
  }) {
    this.canvas = canvas

    // Set up renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })

    // Set up scene
    this.scene = new THREE.Scene()

    // Set up camera
    this.camera = new THREE.PerspectiveCamera(
      VIEWANGLE,
      bounds.width / bounds.height,
      NEAR,
      FAR,
    )
    this.camera.position.z = 400

    // Set up camera controls
    this.controls = new TrackballControls(this.camera, this.canvas)
    this.controls.rotateSpeed = 2.8
    this.controls.minDistance = NEAR
    this.controls.maxDistance = FAR * 0.9

    // Set up layers
    this.layers = {
      grid: new Grid(this.scene),
      points: new Points(this.scene),
      lines: new Lines(this.scene),
      circles: new Circles(this.scene),
      spheres: new Spheres(this.scene),
    }

    // Start render loop
    this.loop()
  }

  public destroy() {
    this.isDestroyed = true
    window.cancelAnimationFrame(this.rafId)
  }

  public resize(bounds: ClientRect) {
    this.renderer.setSize(bounds.width, bounds.height)
    this.camera.aspect = bounds.width / bounds.height
    this.camera.updateProjectionMatrix()
    this.controls.handleResize()
  }

  public update(response: WorkerResponse) {
    const dimensions = response.dimensions
    const particles = map(response.particles, toParticle3)
    each(response.layers, (isLayerVisible, layerName) => {
      const layer = this.layers[layerName as LayerName] // XXX lodash type bug?
      isLayerVisible ? layer.update(particles, dimensions) : layer.clear()
    })
  }

  private loop() {
    if (this.isDestroyed) return
    this.renderer.render(this.scene, this.camera)
    this.rafId = window.requestAnimationFrame(() => this.loop())
    this.controls.update()
  }
}
