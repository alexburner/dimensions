import * as React from 'react'

import Manager from 'src/Manager'

export default class Frame extends React.Component {
  private canvas: HTMLCanvasElement | void
  private container: HTMLDivElement | void
  private manager: Manager

  public render() {
    return (
      <div
        ref={el => el && (this.container = el)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
    )
  }

  public componentDidMount() {
    if (!this.canvas) throw new Error('DOM failed to mount')
    const bounds = this.updateCanvasSize()
    this.manager = new Manager({ canvas: this.canvas, bounds })
    window.addEventListener('resize', this.handleResize)

    // TEMP TODO make form
    this.manager.draw({
      dimensions: 3,
      particles: 20,
      force: {
        name: 'wander',
        maxForce: 10,
        maxSpeed: 10,
        jitter: 10,
      },
      neighbor: {
        name: 'nearest',
      },
      layers: {
        points: true,
        lines: true,
        circles: true,
        spheres: true,
      },
    })
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
}
