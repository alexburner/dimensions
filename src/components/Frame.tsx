import * as React from 'react'

import Controls from 'src/components/Controls'
import Manager from 'src/Manager'
import { WorkerRequest } from 'src/worker'

const CONTROL_WIDTH = 160

export default class Frame extends React.Component<{}, {}> {
  private canvas: HTMLCanvasElement | void
  private container: HTMLDivElement | void
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
          ref={el => el && (this.container = el)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: CONTROL_WIDTH + 'px',
            bottom: 0,
            backgroundColor: '#111',
          }}
        >
          <canvas
            ref={el => el && (this.canvas = el)}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
            }}
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
            onRunningChange={this.handleRunningChange}
          />
        </div>
      </div>
    )
  }

  public componentDidMount() {
    if (!this.canvas) throw new Error('DOM failed to mount')
    if (!this.controls) throw new Error('Controls failed to mount')
    const bounds = this.updateCanvasSize()
    const request = this.controls.getRequest()
    const running = this.controls.getRunning()
    this.manager = new Manager({ canvas: this.canvas, bounds })
    this.manager.draw(request)
    running ? this.manager.resume() : this.manager.pause()
    window.addEventListener('resize', this.handleResize)
    document.addEventListener('visibilitychange', this.handleVisibility)
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('visibilitychange', this.handleVisibility)
    if (this.manager) this.manager.destroy()
  }

  private updateCanvasSize(): ClientRect {
    if (!this.container || !this.canvas) throw new Error('DOM failed to mount')
    const bounds = this.container.getBoundingClientRect()
    this.canvas.style.width = bounds.width + 'px'
    this.canvas.style.height = bounds.height + 'px'
    this.canvas.width = bounds.width
    this.canvas.height = bounds.height
    return bounds
  }

  private handleResize = () => {
    if (!this.manager) return
    const bounds = this.updateCanvasSize()
    this.manager.resize(bounds)
  }

  private handleVisibility = () => {
    if (!this.manager || !this.controls) return
    if (!this.controls.getRunning()) return
    document.hidden ? this.manager.pause() : this.manager.resume()
  }

  private handleRequestChange = (request: WorkerRequest) => {
    if (!this.manager) return
    this.manager.draw(request)
  }

  private handleRunningChange = (running: boolean) => {
    if (!this.manager) return
    running ? this.manager.resume() : this.manager.pause()
  }
}
