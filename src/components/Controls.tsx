import * as React from 'react'

import { LayerName } from 'src/drawing/layers'
import { BehaviorSpecs } from 'src/particles/behaviors'
import { BoundingName } from 'src/particles/boundings'
import { NeighborhoodSpecs } from 'src/particles/neighborhoods'
import { WorkerRequest } from 'src/worker'

interface Props {
  onRequestChange: (request: WorkerRequest) => void
  onRunningChange: (running: boolean) => void
}

interface State {
  running: boolean
  request: WorkerRequest
}

const BEHAVIOR_PRESETS: { [name in BehaviorSpecs['name']]: BehaviorSpecs } = {
  diffusion: {
    name: 'diffusion',
    config: {
      charge: 1,
    },
  },
  wandering: {
    name: 'wandering',
    config: {
      jitter: 1 / 100,
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
  locals: {
    name: 'locals',
    config: {},
  },
  nearest: {
    name: 'nearest',
    config: {},
  },
}

export default class Controls extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      running: true,
      request: {
        dimensions: 3,
        particles: 9,
        max: {
          force: 1,
          speed: 1,
        },
        behavior: BEHAVIOR_PRESETS.wandering,
        neighborhood: NEIGHBORHOOD_PRESETS.nearest,
        boundings: {
          centering: true,
          scaling: true,
          binding: false,
          wrapping: false,
        },
        layers: {
          grid: true,
          points: true,
          lines: true,
          circles: true,
          spheres: true,
        },
      },
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
          Drawing
          <label>
            Grid &nbsp;
            <input
              type="checkbox"
              name="grid"
              checked={this.state.request.layers.grid}
              onChange={this.handleLayers}
            />
          </label>
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
        </div>
        <div>
          Behavior
          <label>
            Wandering &nbsp;
            <input
              type="radio"
              name="wandering"
              checked={this.state.request.behavior.name === 'wandering'}
              onChange={this.handleBehaviors}
            />
          </label>
          <label>
            Diffusion &nbsp;
            <input
              type="radio"
              name="diffusion"
              checked={this.state.request.behavior.name === 'diffusion'}
              onChange={this.handleBehaviors}
            />
          </label>
        </div>
        <div>
          Bounds
          <label>
            Centering &nbsp;
            <input
              type="checkbox"
              name="centering"
              checked={this.state.request.boundings.centering}
              onChange={this.handleBoundings}
            />
          </label>
          <label>
            Scaling &nbsp;
            <input
              type="checkbox"
              name="scaling"
              checked={this.state.request.boundings.scaling}
              onChange={this.handleBoundings}
            />
          </label>
          <label>
            Binding &nbsp;
            <input
              type="checkbox"
              name="binding"
              checked={this.state.request.boundings.binding}
              onChange={this.handleBoundings}
            />
          </label>
        </div>
        <div>
          Neighbors
          <label>
            Nearest &nbsp;
            <input
              type="radio"
              name="nearest"
              checked={this.state.request.neighborhood.name === 'nearest'}
              onChange={this.handleNeighborhoods}
            />
          </label>
          <label>
            Locals &nbsp;
            <input
              type="radio"
              name="locals"
              checked={this.state.request.neighborhood.name === 'locals'}
              onChange={this.handleNeighborhoods}
            />
          </label>
          <label>
            All &nbsp;
            <input
              type="radio"
              name="all"
              checked={this.state.request.neighborhood.name === 'all'}
              onChange={this.handleNeighborhoods}
            />
          </label>
        </div>
      </div>
    )
  }

  public getRequest(): WorkerRequest {
    return this.state.request
  }

  public getRunning(): boolean {
    return this.state.running
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

  private handleBoundings = (e: React.FormEvent<HTMLInputElement>) => {
    const request = { ...this.state.request }
    const name = e.currentTarget.name as BoundingName
    const value = e.currentTarget.checked
    request.boundings[name] = value
    this.props.onRequestChange(request)
    this.setState({ request })
  }

  private handleBehaviors = (e: React.FormEvent<HTMLInputElement>) => {
    const request = { ...this.state.request }
    const name = e.currentTarget.name as LayerName
    const spec = BEHAVIOR_PRESETS[name as BehaviorSpecs['name']]
    request.behavior = spec
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
