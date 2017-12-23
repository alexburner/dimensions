import Renderer from 'src/drawing/Renderer'
import { WorkerRequest } from 'src/worker'
import WorkerLoader from 'worker-loader!src/worker'

export default class Manager {
  private isDestroyed: boolean = false
  private isRunning: boolean = true
  private renderer: Renderer
  private worker: Worker
  private rafId: number

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
          this.renderer.update(e.data.response)
          // Sync worker tick with browser frame rate
          this.rafId = window.requestAnimationFrame(() => {
            if (!this.isRunning || this.isDestroyed) return
            this.worker.postMessage({ type: 'request.tick' })
          })
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

  public draw(request: WorkerRequest) {
    this.worker.postMessage({ type: 'request', request })
  }

  public pause() {
    this.isRunning = false
    window.cancelAnimationFrame(this.rafId)
  }

  public resume() {
    this.isRunning = true
    this.worker.postMessage({ type: 'request.tick' })
  }
}
