import * as React from 'react'

import Canvas from 'src/components/Canvas'
import Controls from 'src/components/Controls'
import Manager from 'src/Manager'
import { WorkerRequest } from 'src/worker'

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
          }}
        >
          <Controls
            ref={controls => (this.controls = controls)}
            onRequestChange={this.handleRequestChange}
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
    const request = this.controls.getRequest()
    const running = this.controls.getRunning()
    const rotating = this.controls.getRotating()
    this.manager = new Manager({ bounds, canvas })
    this.manager.draw(request)
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

  private handleRequestChange = (request: WorkerRequest) => {
    if (!this.manager) return
    this.manager.draw(request)
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
