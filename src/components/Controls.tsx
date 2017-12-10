import * as React from 'react'

import { LayerName } from 'src/drawing/layers'
import { NeighborhoodSpecs } from 'src/geometry/neighborhoods'
import { SimulationSpecs } from 'src/geometry/simulations'
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

const SIMULATION_PRESETS: {
  [name in SimulationSpecs['name']]: SimulationSpecs
} = {
  diffusion: {
    name: 'diffusion',
    config: {
      maxForce: 10,
      maxSpeed: 10,
      charge: 0.1,
    },
  },
  wandering: {
    name: 'wandering',
    config: {
      maxForce: 10,
      maxSpeed: 10,
      jitter: 0.1,
    },
  },
}

const NEIGHBORHOOD_PRESETS: {
  [name in NeighborhoodSpecs['name']]: NeighborhoodSpecs
} = {
  all: {
    name: 'all',
    config: {},
  },
  nearest: {
    name: 'nearest',
    config: {},
  },
  nextNearest: {
    name: 'nextNearest',
    config: {},
  },
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
        <div>
          Simulation
          <label>
            Wandering &nbsp;
            <input
              type="radio"
              name="wandering"
              checked={this.state.request.simulation.name === 'wandering'}
              onChange={this.handleSimulations}
            />
          </label>
          <label>
            Diffusion &nbsp;
            <input
              type="radio"
              name="diffusion"
              checked={this.state.request.simulation.name === 'diffusion'}
              onChange={this.handleSimulations}
            />
          </label>
        </div>
        <div>
          Neighbors
          <label>
            All &nbsp;
            <input
              type="radio"
              name="all"
              checked={this.state.request.neighborhood.name === 'all'}
              onChange={this.handleNeighborhoods}
            />
          </label>
          <label>
            Nearest &nbsp;
            <input
              type="radio"
              name="nearest"
              checked={this.state.request.neighborhood.name === 'nearest'}
              onChange={this.handleNeighborhoods}
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

  private handleSimulations = (e: React.FormEvent<HTMLInputElement>) => {
    const request = { ...this.state.request }
    const name = e.currentTarget.name as LayerName
    const spec = SIMULATION_PRESETS[name as SimulationSpecs['name']]
    request.simulation = spec
    this.props.onRequestChange(request)
    this.setState({ request })
  }

  private handleNeighborhoods = (e: React.FormEvent<HTMLInputElement>) => {
    const request = { ...this.state.request }
    const name = e.currentTarget.name as LayerName
    const spec = NEIGHBORHOOD_PRESETS[name as NeighborhoodSpecs['name']]
    request.neighborhood = spec
    this.props.onRequestChange(request)
    this.setState({ request })
  }

  private handleRun = (e: React.FormEvent<HTMLInputElement>) => {
    const running = e.currentTarget.checked
    this.props.onRunningChange(running)
    this.setState({ running })
  }
}
