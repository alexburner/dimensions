import * as React from 'react'

import Canvas from 'src/components/Canvas'
import Controls from 'src/components/Controls'
import Manager from 'src/Manager'
import { Options } from 'src/options'

export default class Frame extends React.Component<{}, {}> {
  private canvas: Canvas | null
  private controls: Controls | null
  private manager: Manager

  public render() {
    return (
      <div className="frame">
        <Canvas
          ref={canvas => (this.canvas = canvas)}
          onResize={this.handleResize}
        />
        <Controls
          ref={controls => (this.controls = controls)}
          onOptionsChange={this.handleOptionsChange}
          onRotatingChange={this.handleRotatingChange}
        />
      </div>
    )
  }

  public componentDidMount() {
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

  public componentWillUnmount() {
    if (this.manager) this.manager.destroy()
  }

  private handleResize = (bounds: ClientRect) => {
    if (!this.manager) return
    this.manager.resize(bounds)
  }

  private handleOptionsChange = (options: Options) => {
    if (!this.manager) return
    this.manager.draw(options)
  }

  private handleRotatingChange = (rotating: boolean) => {
    if (!this.manager) return
    this.manager.setRotating(rotating)
  }
}
