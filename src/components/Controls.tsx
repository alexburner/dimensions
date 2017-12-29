import * as React from 'react'

import { MAX_PARTICLES } from 'src/constants'
import { LayerName } from 'src/drawing/layers'
import { BehaviorSpecs } from 'src/particles/behaviors'
import { BoundingName } from 'src/particles/boundings'
import { NeighborhoodSpecs } from 'src/particles/neighborhoods'
import { WorkerRequest } from 'src/worker'

interface Props {
  onRunningChange: (running: boolean) => void
  onRotatingChange: (rotating: boolean) => void
  onRequestChange: (request: WorkerRequest) => void
}

interface State {
  running: boolean
  rotating: boolean
  request: WorkerRequest
}

const BEHAVIOR_PRESETS: { [name in BehaviorSpecs['name']]: BehaviorSpecs } = {
  diffusion: {
    name: 'diffusion',
    config: {
      charge: 50,
    },
  },
  diffusionX: {
    name: 'diffusionX',
    config: {
      charge: 0.01,
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
  },
  locals: {
    name: 'locals',
  },
  nearest: {
    name: 'nearest',
  },
  proximity: {
    name: 'nearest',
    config: {
      min: 1,
      max: 10,
    },
  },
}

export default class Controls extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      running: true,
      rotating: true,
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
          <input
            type="checkbox"
            name="run"
            checked={this.state.running}
            onChange={this.handleRunning}
          />
          &nbsp; Running
        </label>
        <label>
          <input
            type="checkbox"
            name="run"
            checked={this.state.rotating}
            onChange={this.handleRotating}
          />
          &nbsp; Rotating
        </label>
        <hr />
        <label>
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
            onKeyDown={this.handleEnter}
          />
          &nbsp; Dimensions
        </label>
        <label>
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
            onKeyDown={this.handleEnter}
          />
          &nbsp; Particles
        </label>
        <hr />
        <div>
          Layers
          <label>
            <input
              type="checkbox"
              name="points"
              checked={this.state.request.layers.points}
              onChange={this.handleLayers}
            />
            &nbsp; 0D &mdash; Points
          </label>
          <label>
            <input
              type="checkbox"
              name="lines"
              checked={this.state.request.layers.lines}
              onChange={this.handleLayers}
            />
            &nbsp; 1D &mdash; Lines
          </label>
          <label>
            <input
              type="checkbox"
              name="circles"
              checked={this.state.request.layers.circles}
              onChange={this.handleLayers}
            />
            &nbsp; 2D &mdash; Circles
          </label>
          <label>
            <input
              type="checkbox"
              name="spheres"
              checked={this.state.request.layers.spheres}
              onChange={this.handleLayers}
            />
            &nbsp; 3D &mdash; Spheres
          </label>
          <label>
            <input
              type="checkbox"
              name="grid"
              checked={this.state.request.layers.grid}
              onChange={this.handleLayers}
            />
            &nbsp; Grid
          </label>
        </div>
        <hr />
        <div>
          Behavior
          <label>
            <input
              type="radio"
              name="wandering"
              checked={this.state.request.behavior.name === 'wandering'}
              onChange={this.handleBehaviors}
            />
            &nbsp; Wandering
          </label>
          <label>
            <input
              type="radio"
              name="diffusion"
              checked={this.state.request.behavior.name === 'diffusion'}
              onChange={this.handleBehaviors}
            />
            &nbsp; Diffusion
          </label>
          {/*<label>
            <input
              type="radio"
              name="diffusionX"
              checked={this.state.request.behavior.name === 'diffusionX'}
              onChange={this.handleBehaviors}
            />
            Diffusion X &nbsp;
          </label>*/}
        </div>
        <hr />
        <div>
          Neighbors
          <label>
            <input
              type="radio"
              name="nearest"
              checked={this.state.request.neighborhood.name === 'nearest'}
              onChange={this.handleNeighborhoods}
            />
            &nbsp; Nearest
          </label>
          <label>
            <input
              type="radio"
              name="locals"
              checked={this.state.request.neighborhood.name === 'locals'}
              onChange={this.handleNeighborhoods}
            />
            &nbsp; Locals
          </label>
          <label>
            <input
              type="radio"
              name="all"
              checked={this.state.request.neighborhood.name === 'all'}
              onChange={this.handleNeighborhoods}
            />
            &nbsp; All
          </label>
        </div>
        <hr />
        <div>
          Bounds
          <label>
            <input
              type="checkbox"
              name="centering"
              checked={this.state.request.boundings.centering}
              onChange={this.handleBoundings}
            />
            &nbsp; Centering
          </label>
          <label>
            <input
              type="checkbox"
              name="scaling"
              checked={this.state.request.boundings.scaling}
              onChange={this.handleBoundings}
            />
            &nbsp; Scaling
          </label>
          <label>
            <input
              type="checkbox"
              name="binding"
              checked={this.state.request.boundings.binding}
              onChange={this.handleBoundings}
            />
            &nbsp; Binding
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

  public getRotating(): boolean {
    return this.state.rotating
  }

  private handleDimensions = (e: React.FormEvent<HTMLInputElement>) => {
    const request = { ...this.state.request }
    request.dimensions = Number(e.currentTarget.value)
    this.props.onRequestChange(request)
    this.setState({ request })
  }

  private handleParticles = (e: React.FormEvent<HTMLInputElement>) => {
    const request = { ...this.state.request }
    const particles = Number(e.currentTarget.value)
    request.particles = Math.min(particles, MAX_PARTICLES)
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

  private handleRunning = (e: React.FormEvent<HTMLInputElement>) => {
    const running = e.currentTarget.checked
    this.props.onRunningChange(running)
    this.setState({ running })
  }

  private handleRotating = (e: React.FormEvent<HTMLInputElement>) => {
    const rotating = e.currentTarget.checked
    this.props.onRotatingChange(rotating)
    this.setState({ rotating })
  }

  private handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // For mobile devices, easier dismissing of keyboards
    if (e.key === 'Enter') e.currentTarget.blur()
  }
}
