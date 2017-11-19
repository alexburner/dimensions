import Renderer from 'src/drawing/Renderer'
import WorkerLoader from 'worker-loader!src/drawing/worker'

export default class Manager {
  private isDestroyed: boolean = false
  private renderer: Renderer
  private worker: Worker

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.renderer = new Renderer({ canvas })
    this.worker = new WorkerLoader()
    this.worker.addEventListener('message', e => {
      console.log('Main worker message', e)
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
}
