import { random } from 'lodash'
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'

import Circle from 'src/drawing/elements/Circle'
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
    this.controls.panSpeed = 1.6
    const light = new THREE.PointLight(0xffffff)
    light.position.x = 600
    light.position.y = 600
    light.position.z = 600
    this.scene.add(light)
    this.loop()

    // {
    //   const D = 300
    //   for (let i = 0; i < 100; i++) {
    //     const x = random(-D, D)
    //     const y = random(-D, D)
    //     const z = random(-D, D)
    //     const sphere = new Sphere({ position: new THREE.Vector3(x, y, z) })
    //     this.scene.add(sphere.mesh)
    //   }
    // }

    const sphere = new Sphere({ position: new THREE.Vector3(60, 0, 0) })
    const circle = new Circle({ position: new THREE.Vector3(0, 0, 0) })
    this.scene.add(sphere.object)
    this.scene.add(circle.object)
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
