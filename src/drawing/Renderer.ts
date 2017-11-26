import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'

import { WorkerResponse } from 'src/interfaces'

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
    console.log(response)
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
