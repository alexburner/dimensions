import * as React from 'react'

interface Props {
  onResize: (bounds: ClientRect) => void
}

export default class Frame extends React.Component<Props, {}> {
  private canvas: HTMLCanvasElement | void
  private container: HTMLDivElement | void
  private bounds: ClientRect | void

  public render() {
    return (
      <div
        ref={el => el && (this.container = el)}
        style={{ width: '100%', height: '100%' }}
      >
        <canvas
          ref={el => el && (this.canvas = el)}
          style={{ display: 'block' }}
        />
      </div>
    )
  }

  public componentDidMount() {
    this.updateCanvasSize()
    window.addEventListener('resize', this.handleResize)
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  public getBounds(): ClientRect | void {
    return this.bounds
  }

  public getElement(): HTMLCanvasElement | void {
    return this.canvas
  }

  private updateCanvasSize(): ClientRect {
    if (!this.container || !this.canvas) throw new Error('DOM failed to mount')
    const bounds = this.container.getBoundingClientRect()
    this.canvas.style.width = bounds.width + 'px'
    this.canvas.style.height = bounds.height + 'px'
    this.canvas.width = bounds.width
    this.canvas.height = bounds.height
    this.bounds = bounds
    return bounds
  }

  private handleResize = () => {
    const bounds = this.updateCanvasSize()
    this.props.onResize(bounds)
  }
}
