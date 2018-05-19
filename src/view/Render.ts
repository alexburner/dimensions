import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'

const NEAR = 1
const FAR = 5000
const VIEWANGLE = 45

export default class Render {
  public canvas: HTMLCanvasElement
  public renderer: THREE.WebGLRenderer
  public scene: THREE.Scene
  public group: THREE.Group
  public camera: THREE.PerspectiveCamera
  public controls: TrackballControls

  private isDestroyed: boolean = false
  private isRotating: boolean = false
  private rafId?: number

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
    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true

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
    const ZOOM = 6
    this.camera.position.x = 0
    this.camera.position.y = 7 * ZOOM
    this.camera.position.z = 40 * ZOOM

    // Set up camera controls
    this.controls = new TrackballControls(this.camera, this.canvas)
    this.controls.rotateSpeed = 2.8
    this.controls.minDistance = NEAR
    this.controls.maxDistance = FAR * 0.9

    // Start render loop
    this.loop()
  }

  public destroy() {
    this.isDestroyed = true
    if (this.rafId) window.cancelAnimationFrame(this.rafId)
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

  private loop() {
    if (this.isDestroyed) return
    if (this.isRotating) this.rotateCamera()
    this.renderer.render(this.scene, this.camera)
    this.controls.update()
    this.rafId = window.requestAnimationFrame(() => this.loop())
  }

  private rotateCamera() {
    const speed = 0.001
    const speedSin = Math.sin(speed)
    const speedCos = Math.cos(speed)
    const x = this.camera.position.x
    const z = this.camera.position.z
    this.camera.position.x = x * speedCos + z * speedSin
    this.camera.position.z = z * speedCos - x * speedSin
    this.camera.lookAt(this.scene.position)
  }
}
