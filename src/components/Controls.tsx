import * as React from 'react'

import { LayerName } from 'src/drawing/layers'
import { WorkerRequest } from 'src/worker'

interface Props {
  request: WorkerRequest
  onChange: (request: WorkerRequest) => void
}

interface State {
  request: WorkerRequest
}

export default class Controls extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { request: { ...props.request } }
  }

  public render() {
    return (
      <div className="controls">
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
              checked={this.state.request.layerVisibility.points}
              onChange={this.handleLayers}
            />
          </label>
          <label>
            Lines &nbsp;
            <input
              type="checkbox"
              name="lines"
              checked={this.state.request.layerVisibility.lines}
              onChange={this.handleLayers}
            />
          </label>
          <label>
            Circles &nbsp;
            <input
              type="checkbox"
              name="circles"
              checked={this.state.request.layerVisibility.circles}
              onChange={this.handleLayers}
            />
          </label>
          <label>
            Spheres &nbsp;
            <input
              type="checkbox"
              name="spheres"
              checked={this.state.request.layerVisibility.spheres}
              onChange={this.handleLayers}
            />
          </label>
          <label>
            Grid &nbsp;
            <input
              type="checkbox"
              name="grid"
              checked={this.state.request.layerVisibility.grid}
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
    this.props.onChange(request)
    this.setState({ request })
  }

  private handleParticles = (e: React.FormEvent<HTMLInputElement>) => {
    const request = { ...this.state.request }
    request.particles = Number(e.currentTarget.value)
    this.props.onChange(request)
    this.setState({ request })
  }

  private handleLayers = (e: React.FormEvent<HTMLInputElement>) => {
    const request = { ...this.state.request }
    const name = e.currentTarget.name as LayerName
    const value = e.currentTarget.checked
    request.layerVisibility[name] = value
    this.props.onChange(request)
    this.setState({ request })
  }
}
