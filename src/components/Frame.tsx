import * as React from 'react'

import Manager from 'src/drawing/Manager'

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
    if (!this.container || !this.canvas) throw new Error('DOM failed to mount')
    this.manager = new Manager({ canvas: this.canvas })
    window.addEventListener('resize', this.handleResize)
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    if (this.manager) this.manager.destroy()
  }

  private handleResize = () => {
    if (!this.canvas || !this.manager) return
    this.manager.resize()
  }
}