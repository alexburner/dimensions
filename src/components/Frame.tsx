import * as React from 'react'

import Canvas from 'src/components/Canvas'
import Controls from 'src/components/Controls'
import Manager from 'src/Manager'
import { Options } from 'src/options'

const CONTROL_WIDTH = 165

export default class Frame extends React.Component<{}, {}> {
  private canvas: Canvas | null
  private controls: Controls | null
  private manager: Manager

  public render() {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: CONTROL_WIDTH + 'px',
            bottom: 0,
            backgroundColor: '#111',
          }}
        >
          <Canvas
            ref={canvas => (this.canvas = canvas)}
            onResize={this.handleResize}
          />
        </div>
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: CONTROL_WIDTH + 'px',
            backgroundColor: '#222',
            borderLeft: '1px solid #333',
            overflow: 'auto',
          }}
        >
          <Controls
            ref={controls => (this.controls = controls)}
            onOptionsChange={this.handleOptionsChange}
            onRotatingChange={this.handleRotatingChange}
            onRunningChange={this.handleRunningChange}
          />
        </div>
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
    const running = this.controls.getRunning()
    const rotating = this.controls.getRotating()
    this.manager = new Manager({ bounds, canvas })
    this.manager.draw(options)
    this.manager.setRunning(running)
    this.manager.setRotating(rotating)
    document.addEventListener('visibilitychange', this.handleVisibility)
  }

  public componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.handleVisibility)
    if (this.manager) this.manager.destroy()
  }

  private handleResize = (bounds: ClientRect) => {
    if (!this.manager) return
    this.manager.resize(bounds)
  }

  private handleVisibility = () => {
    if (!this.manager || !this.controls) return
    if (!this.controls.getRunning()) return
    this.manager.setRunning(!document.hidden)
  }

  private handleOptionsChange = (options: Options) => {
    if (!this.manager) return
    this.manager.draw(options)
  }

  private handleRunningChange = (running: boolean) => {
    if (!this.manager) return
    this.manager.setRunning(running)
  }

  private handleRotatingChange = (rotating: boolean) => {
    if (!this.manager) return
    this.manager.setRotating(rotating)
  }
}
