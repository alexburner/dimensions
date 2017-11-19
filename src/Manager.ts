import Drawing from 'src/Drawing'
import WorkerLoader from 'worker-loader!src/worker'

export default class Manager {
  private isDestroyed: boolean = false
  private drawing: Drawing
  private worker: Worker

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.drawing = new Drawing({ canvas })
    this.worker = new WorkerLoader()
    this.worker.addEventListener('message', e => {
      console.log('Main worker message', e)
    })
    this.worker.postMessage({ foo: 'bar' })
  }

  public destroy() {
    this.isDestroyed = true
    this.drawing.destroy()
  }

  public resize() {
    this.drawing.resize()
  }
}
