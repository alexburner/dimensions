import { map } from 'lodash'
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'

import { math, toVector3 } from 'src/geometry/vector-n'
import { RenderParticle, WorkerResponse } from 'src/interfaces'

import Circles from 'src/drawing/layers/Circles'
import Lines from 'src/drawing/layers/Lines'
import Points from 'src/drawing/layers/Points'
import Spheres from 'src/drawing/layers/Spheres'

const NEAR = 1
const FAR = 5000
const VIEWANGLE = 45

export default class Renderer {
  private isDestroyed: boolean = false
  private rafId: number
  private canvas: HTMLCanvasElement
  private width: number
  private height: number
  private renderer: THREE.Renderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: TrackballControls
  private points: Points
  private lines: Lines
  private circles: Circles
  private spheres: Spheres

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.canvas = canvas

    // Measure canvas size
    const bounds = this.canvas.getBoundingClientRect()
    this.width = bounds.width
    this.height = bounds.height

    // Set up renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    // TODO force canvas size, let THREE use that
    this.renderer.setSize(this.width, this.height)

    // Set up scene
    this.scene = new THREE.Scene()

    // Set up camera
    this.camera = new THREE.PerspectiveCamera(
      VIEWANGLE,
      this.width / this.height,
      NEAR,
      FAR,
    )
    this.camera.position.z = 900

    // Set up camera controls
    this.controls = new TrackballControls(this.camera, this.canvas)
    this.controls.rotateSpeed = 2.8

    // Add light to scene
    const light = new THREE.PointLight(0xffffff)
    light.position.x = 600
    light.position.y = 600
    light.position.z = 600
    this.scene.add(light)

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

  public resize() {
    const bounds = this.canvas.getBoundingClientRect()
    this.width = bounds.width
    this.height = bounds.height
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.controls.handleResize()
  }

  public tick(response: WorkerResponse) {
    // TODO move this into worker
    // and/or remove distinction...
    // use absolute values throughout?
    const size = Math.min(this.width, this.height)
    const renderParticles: RenderParticle[] = map(response.particles, p => ({
      location: toVector3(math.multiply(p.location, size / 2)),
      velocity: toVector3(math.multiply(p.velocity, size / 2)),
      acceleration: toVector3(math.multiply(p.acceleration, size / 2)),
      neighborIndices: p.neighborIndices,
    }))

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
