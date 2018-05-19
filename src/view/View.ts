import { RenderOptions, WorkerResponse } from 'src/options'
import Layers from 'src/view/Layers'
import Render from 'src/view/Render'

export default class View {
  private render: Render
  private layers: Layers

  constructor({
    canvas,
    bounds,
  }: {
    canvas: HTMLCanvasElement
    bounds: ClientRect
  }) {
    this.render = new Render({ canvas, bounds })
    this.layers = new Layers(this.render.group, this.render.camera)
  }

  public update(ro: RenderOptions, wr: WorkerResponse) {
    this.layers.update(ro, wr)
  }

  public resize(bounds: ClientRect) {
    this.render.resize(bounds)
  }
  public setRotating(rotating: boolean) {
    this.render.setRotating(rotating)
  }

  public destroy() {
    this.render.destroy()
  }
}
