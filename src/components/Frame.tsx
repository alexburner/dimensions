import * as React from 'react'

import Controls from 'src/components/Controls'
import { WorkerRequest } from 'src/interfaces'
import Manager from 'src/Manager'

const CONTROL_WIDTH = 180

const initialRequest: WorkerRequest = {
  dimensions: 3,
  particles: 9,
  force: {
    name: 'wander',
    maxForce: 10,
    maxSpeed: 10,
    jitter: 10,
  },
  neighbor: {
    name: 'nearest',
  },
  layerVisibility: {
    grid: false,
    points: true,
    lines: true,
    circles: true,
    spheres: true,
  },
}

export default class Frame extends React.Component<{}, {}> {
  private canvas: HTMLCanvasElement | void
  private container: HTMLDivElement | void
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
            onChange={this.handleRequestChange}
            request={initialRequest}
          />
        </div>
      </div>
    )
  }

  public componentDidMount() {
    if (!this.canvas) throw new Error('DOM failed to mount')
    const bounds = this.updateCanvasSize()
    this.manager = new Manager({ canvas: this.canvas, bounds })
    this.manager.draw(initialRequest)
    window.addEventListener('resize', this.handleResize)
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
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

  private handleRequestChange = (request: WorkerRequest) => {
    this.manager.draw(request)
  }
}
