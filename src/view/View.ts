import { RenderOptions, WorkerResponse } from 'src/options'
import Layers from 'src/view/Layers'
import Render from 'src/view/Render'

export default class View {
  private readonly render: Render
  private readonly layers: Layers

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

  public update(ro: RenderOptions, wr: WorkerResponse): void {
    this.layers.update(ro, wr)
  }

  public resize(bounds: ClientRect): void {
    this.render.resize(bounds)
  }
  public setRotating(rotating: boolean): void {
    this.render.setRotating(rotating)
  }

  public destroy(): void {
    this.render.destroy()
  }
}
