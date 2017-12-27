import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'

import { Layer, LayerName } from 'src/drawing/layers'
import Circles from 'src/drawing/layers/Circles'
import Grid from 'src/drawing/layers/Grid'
import Lines from 'src/drawing/layers/Lines'
import Points from 'src/drawing/layers/Points'
import Spheres from 'src/drawing/layers/Spheres'
import Particle3 from 'src/particles/Particle3'
import { WorkerResponse } from 'src/worker'

const NEAR = 1
const FAR = 5000
const VIEWANGLE = 45

export default class Renderer {
  private isDestroyed: boolean = false
  private isRotating: boolean = false
  private canvas: HTMLCanvasElement
  private renderer: THREE.Renderer
  private scene: THREE.Scene
  private group: THREE.Group
  private camera: THREE.PerspectiveCamera
  private controls: TrackballControls
  private layers: { [name in LayerName]: Layer }
  private layerNames: LayerName[]
  private rafId: number

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

    // Set up scene & group
    this.scene = new THREE.Scene()
    this.group = new THREE.Group()
    this.scene.add(this.group)

    // Set up camera
    this.camera = new THREE.PerspectiveCamera(
      VIEWANGLE,
      bounds.width / bounds.height,
      NEAR,
      FAR,
    )
    this.camera.position.x = 0
    this.camera.position.y = 40
    this.camera.position.z = 400

    // Set up camera controls
    this.controls = new TrackballControls(this.camera, this.canvas)
    this.controls.rotateSpeed = 2.8
    this.controls.minDistance = NEAR
    this.controls.maxDistance = FAR * 0.9

    // Set up layers
    this.layers = {
      grid: new Grid(this.group),
      points: new Points(this.group),
      lines: new Lines(this.group),
      circles: new Circles(this.group),
      spheres: new Spheres(this.group),
    }
    this.layerNames = Object.keys(this.layers) as LayerName[]

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

  public setRotating(rotating: boolean) {
    this.isRotating = rotating
  }

  public update(response: WorkerResponse) {
    const dimensions = response.dimensions
    const neighborhood = response.neighborhood
    const particles = response.particles.map(p => new Particle3(p))
    this.layerNames.forEach(layerName => {
      const layer = this.layers[layerName]
      const layerVisible = response.layers[layerName]
      layerVisible
        ? layer.update({ particles, dimensions, neighborhood })
        : layer.clear()
    })
  }

  private loop() {
    if (this.isDestroyed) return
    if (this.isRotating) this.group.rotation.y -= 0.001
    this.renderer.render(this.scene, this.camera)
    this.controls.update()
    this.rafId = window.requestAnimationFrame(() => this.loop())
  }
}
