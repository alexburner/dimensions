import Renderer from 'src/drawing/Renderer'
import { WorkerRequest } from 'src/interfaces'
import WorkerLoader from 'worker-loader!src/worker'

export default class Manager {
  private isDestroyed: boolean = false
  private renderer: Renderer
  private worker: Worker

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.renderer = new Renderer({ canvas })
    this.worker = new WorkerLoader()
    this.worker.addEventListener('message', e => {
      console.log('Main worker message', e)
      if (!(e && e.data && e.data.type)) return
      switch (e.data.type) {
        case 'tick': {
          this.renderer.tick(e.data.response)
        }
      }
    })
    this.worker.postMessage({ foo: 'bar' })
  }

  public destroy() {
    this.isDestroyed = true
    this.renderer.destroy()
  }

  public resize() {
    this.renderer.resize()
  }

  public draw(request: WorkerRequest) {
    this.worker.postMessage({
      type: 'request',
      request,
    })
  }
}
