import Renderer from 'src/drawing/Renderer'
import {
  Options,
  RenderOptions,
  WorkerOptions,
  WorkerResponse,
} from 'src/options'
import WorkerLoader from 'worker-loader!src/worker'

export default class Manager {
  private isDestroyed: boolean = false
  private isRunning: boolean = true
  private renderer: Renderer
  private worker: Worker
  private rafId: number

  private workerOptions: WorkerOptions | void
  private renderOptions: RenderOptions | void
  private workerResponse: WorkerResponse | void

  constructor({
    canvas,
    bounds,
  }: {
    canvas: HTMLCanvasElement
    bounds: ClientRect
  }) {
    this.renderer = new Renderer({ canvas, bounds })
    this.worker = new WorkerLoader()
    this.worker.addEventListener('message', e => {
      if (this.isDestroyed) return
      if (!(e && e.data && e.data.type)) return
      switch (e.data.type) {
        case 'update': {
          if (!this.renderOptions) return // XXX theoretically unreachable
          this.workerResponse = e.data.response as WorkerResponse
          this.renderer.update(this.renderOptions, this.workerResponse)
          // Sync worker tick with browser frame rate
          const rafId = (this.rafId = window.requestAnimationFrame(() => {
            if (rafId !== this.rafId) return // out of date
            if (!this.isRunning || this.isDestroyed) return
            this.worker.postMessage({ type: 'update.tick' })
          }))
          break
        }
      }
    })
  }

  public destroy() {
    this.isDestroyed = true
    this.isRunning = false
    window.cancelAnimationFrame(this.rafId)
    this.worker.postMessage({ type: 'destroy' })
    this.renderer.destroy()
  }

  public resize(bounds: ClientRect) {
    this.renderer.resize(bounds)
  }

  public draw(options: Options) {
    // Split options for worker & renderer
    this.workerOptions = {
      dimensions: options.dimensions,
      particles: options.particles,
      max: options.max,
      behavior: options.behavior,
      neighborhood: options.neighborhood,
      boundings: options.boundings,
    }
    this.renderOptions = {
      layers: options.layers,
    }
    // Update worker
    this.worker.postMessage({ type: 'update', options: this.workerOptions })
    // Update renderer IF we have a prior worker response
    if (this.workerResponse) {
      this.renderer.update(this.renderOptions, this.workerResponse)
    }
  }

  public setRunning(running: boolean) {
    if (running) {
      this.isRunning = true
      this.worker.postMessage({ type: 'update.tick' })
    } else {
      this.isRunning = false
      window.cancelAnimationFrame(this.rafId)
    }
  }

  public setRotating(rotating: boolean) {
    this.renderer.setRotating(rotating)
  }
}
