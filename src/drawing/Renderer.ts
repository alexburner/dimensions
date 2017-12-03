import { map } from 'lodash'
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'

import { toParticle3 } from 'src/geometry/particles'
import { WorkerResponse } from 'src/interfaces'

import Circles from 'src/drawing/layers/Circles'
import Lines from 'src/drawing/layers/Lines'
import Points from 'src/drawing/layers/Points'
import Spheres from 'src/drawing/layers/Spheres'

const NEAR = 1
const FAR = 10000
const VIEWANGLE = 45

export default class Renderer {
  private isDestroyed: boolean = false
  private rafId: number
  private canvas: HTMLCanvasElement
  private renderer: THREE.Renderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: TrackballControls
  private points: Points
  private lines: Lines
  private circles: Circles
  private spheres: Spheres

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
    this.camera.position.z = 900

    // Set up camera controls
    this.controls = new TrackballControls(this.camera, this.canvas)
    this.controls.rotateSpeed = 2.8

    // Start render loop
    this.loop()

    // Set up layers
    this.points = new Points(this.scene)
    this.lines = new Lines(this.scene)
    this.circles = new Circles(this.scene)
    this.spheres = new Spheres(this.scene)
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

  public tick(response: WorkerResponse) {
    const renderParticles = map(response.particles, toParticle3)
    response.layers.points
      ? this.points.update(renderParticles)
      : this.points.clear()
    response.layers.lines
      ? this.lines.update(renderParticles)
      : this.lines.clear()
    response.layers.circles
      ? this.circles.update(renderParticles)
      : this.circles.clear()
    response.layers.spheres
      ? this.spheres.update(renderParticles)
      : this.spheres.clear()
  }

  private loop() {
    if (this.isDestroyed) return
    this.renderer.render(this.scene, this.camera)
    this.rafId = window.requestAnimationFrame(() => this.loop())
    this.controls.update()
  }
}
