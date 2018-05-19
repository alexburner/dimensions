import * as React from 'react'

import Canvas from 'src/components/Canvas'
import Controls from 'src/components/Controls'
import Manager from 'src/Manager'
import { Options } from 'src/options'

export default class Frame extends React.Component<{}, {}> {
  private canvas?: Canvas
  private controls?: Controls
  private manager?: Manager

  public render(): JSX.Element {
    return (
      <div className="frame">
        <Canvas
          ref={(el: Canvas): Canvas => (this.canvas = el)}
          onResize={this.handleResize}
        />
        <Controls
          ref={(el: Controls): Controls => (this.controls = el)}
          onOptionsChange={this.handleOptionsChange}
          onRotatingChange={this.handleRotatingChange}
        />
      </div>
    )
  }

  public componentDidMount(): void {
    if (!this.canvas) throw new Error('Canvas failed to mount')
    if (!this.controls) throw new Error('Controls failed to mount')
    const bounds = this.canvas.getBounds()
    const canvas = this.canvas.getElement()
    if (!bounds || !canvas) throw new Error('Canvas failed to initialize')
    const options = this.controls.getOptions()
    const rotating = this.controls.getRotating()
    this.manager = new Manager({ bounds, canvas })
    this.manager.draw(options)
    this.manager.setRotating(rotating)
  }

  public componentWillUnmount(): void {
    if (this.manager) this.manager.destroy()
  }

  private readonly handleResize = (bounds: ClientRect): void => {
    if (!this.manager) return
    this.manager.resize(bounds)
  }

  private readonly handleOptionsChange = (options: Options): void => {
    if (!this.manager) return
    this.manager.draw(options)
  }

  private readonly handleRotatingChange = (rotating: boolean): void => {
    if (!this.manager) return
    this.manager.setRotating(rotating)
  }
}
