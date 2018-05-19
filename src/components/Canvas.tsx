import * as React from 'react'

interface Props {
  onResize(bounds: ClientRect): void
}

export default class Frame extends React.Component<Props, {}> {
  private canvas?: HTMLCanvasElement
  private container?: HTMLDivElement
  private bounds?: ClientRect

  public render(): JSX.Element {
    return (
      <div
        ref={(el: HTMLDivElement): HTMLDivElement => (this.container = el)}
        style={{ width: '100%', height: '100%' }}
      >
        <canvas
          ref={(el: HTMLCanvasElement): HTMLCanvasElement => (this.canvas = el)}
          style={{ display: 'block' }}
        />
      </div>
    )
  }

  public componentDidMount(): void {
    this.updateCanvasSize()
    window.addEventListener('resize', this.handleResize)
  }

  public componentWillUnmount(): void {
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
    this.canvas.style.width = `${bounds.width}px`
    this.canvas.style.height = `${bounds.height}px`
    this.canvas.width = bounds.width
    this.canvas.height = bounds.height
    this.bounds = bounds
    return bounds
  }

  private readonly handleResize = (): void => {
    const bounds = this.updateCanvasSize()
    this.props.onResize(bounds)
  }
}
