import * as React from 'react'

import { LayerName } from 'src/drawing/layers'
import { WorkerRequest } from 'src/worker'

interface Props {
  running: boolean
  request: WorkerRequest
  onRequestChange: (request: WorkerRequest) => void
  onRunningChange: (running: boolean) => void
}

interface State {
  running: boolean
  request: WorkerRequest
}

export default class Controls extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      running: props.running,
      request: { ...props.request },
    }
  }

  public render() {
    return (
      <div className="controls">
        <label>
          Running &nbsp;
          <input
            type="checkbox"
            name="run"
            checked={this.state.running}
            onChange={this.handleRun}
          />
        </label>
        <label>
          Dimensions &nbsp;
          <input
            type="number"
            style={{
              width: '30px',
              textAlign: 'center',
            }}
            min="0"
            step="1"
            value={this.state.request.dimensions}
            onChange={this.handleDimensions}
          />
        </label>
        <label>
          Particles &nbsp;
          <input
            type="number"
            style={{
              width: '30px',
              textAlign: 'center',
            }}
            min="0"
            step="1"
            value={this.state.request.particles}
            onChange={this.handleParticles}
          />
        </label>
        <div>
          Layers
          <label>
            Points &nbsp;
            <input
              type="checkbox"
              name="points"
              checked={this.state.request.layers.points}
              onChange={this.handleLayers}
            />
          </label>
          <label>
            Lines &nbsp;
            <input
              type="checkbox"
              name="lines"
              checked={this.state.request.layers.lines}
              onChange={this.handleLayers}
            />
          </label>
          <label>
            Circles &nbsp;
            <input
              type="checkbox"
              name="circles"
              checked={this.state.request.layers.circles}
              onChange={this.handleLayers}
            />
          </label>
          <label>
            Spheres &nbsp;
            <input
              type="checkbox"
              name="spheres"
              checked={this.state.request.layers.spheres}
              onChange={this.handleLayers}
            />
          </label>
          <label>
            Grid &nbsp;
            <input
              type="checkbox"
              name="grid"
              checked={this.state.request.layers.grid}
              onChange={this.handleLayers}
            />
          </label>
        </div>
      </div>
    )
  }

  private handleDimensions = (e: React.FormEvent<HTMLInputElement>) => {
    const request = { ...this.state.request }
    request.dimensions = Number(e.currentTarget.value)
    this.props.onRequestChange(request)
    this.setState({ request })
  }

  private handleParticles = (e: React.FormEvent<HTMLInputElement>) => {
    const request = { ...this.state.request }
    request.particles = Number(e.currentTarget.value)
    this.props.onRequestChange(request)
    this.setState({ request })
  }

  private handleLayers = (e: React.FormEvent<HTMLInputElement>) => {
    const request = { ...this.state.request }
    const name = e.currentTarget.name as LayerName
    const value = e.currentTarget.checked
    request.layers[name] = value
    this.props.onRequestChange(request)
    this.setState({ request })
  }

  private handleRun = (e: React.FormEvent<HTMLInputElement>) => {
    const running = e.currentTarget.checked
    this.props.onRunningChange(running)
    this.setState({ running })
  }
}
