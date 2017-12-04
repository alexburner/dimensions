import Renderer from 'src/drawing/Renderer'
import { WorkerRequest } from 'src/worker'
import WorkerLoader from 'worker-loader!src/worker'

export default class Manager {
  private isDestroyed: boolean = false
  private renderer: Renderer
  private worker: Worker

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
          break
        }
      }
    })
  }

  public destroy() {
    this.isDestroyed = true
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
    this.worker.postMessage({ type: 'pause' })
  }

  public resume() {
    this.worker.postMessage({ type: 'resume' })
  }
}
