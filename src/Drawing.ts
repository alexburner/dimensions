import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'

const NEAR = 1
const FAR = 5000
const VIEWANGLE = 45

export default class Drawing {
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
    this.controls = new TrackballControls(this.camera, this.canvas)
    this.camera.position.z = 900
    this.loop()

    // TEMP HELLO WORLD
    {
      const light = new THREE.PointLight(0xffffff)
      light.position.x = 200
      light.position.y = 200
      light.position.z = 200
      this.scene.add(light)

      const geometry = new THREE.SphereGeometry(
        100, // radius
        30, // segments
        30, // rings
      )
      const material = new THREE.MeshLambertMaterial({
        transparent: true,
        opacity: 0.88,
        color: 0xffffff,
      })
      const mesh = new THREE.Mesh(geometry, material)
      this.scene.add(mesh)
    }
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
