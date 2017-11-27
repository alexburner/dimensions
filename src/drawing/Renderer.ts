import { map } from 'lodash'
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'

import { math, toVector3 } from 'src/geometry/vector-n'
import { RenderParticle, WorkerResponse } from 'src/interfaces'

import Lines from 'src/drawing/layers/Lines'
import Points from 'src/drawing/layers/Points'

import Circle from 'src/drawing/elements/Circle'
import Line from 'src/drawing/elements/Line'
import Point from 'src/drawing/elements/Point'
import Sphere from 'src/drawing/elements/Sphere'

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

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.canvas = canvas
    this.updateSize()
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    this.renderer.setSize(this.width, this.height)
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      VIEWANGLE,
      this.width / this.height,
      NEAR,
      FAR,
    )
    this.camera.position.z = 900
    this.controls = new TrackballControls(this.camera, this.canvas)
    this.controls.rotateSpeed = 2.8
    const light = new THREE.PointLight(0xffffff)
    light.position.x = 600
    light.position.y = 600
    light.position.z = 600
    this.scene.add(light)
    this.loop()

    // const point = new Point({ position: new THREE.Vector3(0, 0, 0) })
    // const line = new Line({ position: new THREE.Vector3(0, 0, 0) })
    // const circle = new Circle({ position: new THREE.Vector3(0, 0, 0) })
    // const sphere = new Sphere({ position: new THREE.Vector3(60, 0, 0) })

    // this.scene.add(point.object)
    // this.scene.add(line.object)
    // this.scene.add(circle.object)
    // this.scene.add(sphere.object)

    this.points = new Points(this.scene)
    this.lines = new Lines(this.scene)
  }

  public destroy() {
    this.isDestroyed = true
    window.cancelAnimationFrame(this.rafId)
  }

  public resize() {
    this.updateSize()
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
      ? this.points.tick(renderParticles)
      : this.points.clear()
    response.layers.lines
      ? this.lines.tick(renderParticles)
      : this.lines.clear()
  }

  private loop() {
    if (this.isDestroyed) return
    this.renderer.render(this.scene, this.camera)
    this.rafId = window.requestAnimationFrame(() => this.loop())
    this.controls.update()
  }

  private updateSize() {
    const bounds = this.canvas.getBoundingClientRect()
    this.width = bounds.width
    this.height = bounds.height
  }
}
