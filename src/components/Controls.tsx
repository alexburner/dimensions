import * as React from 'react'

import { MAX_PARTICLES } from 'src/constants'
import { LayerName } from 'src/drawing/layers'
import { Options } from 'src/options'
import { BehaviorSpecs } from 'src/particles/behaviors'
import { BoundingName } from 'src/particles/boundings'
import { NeighborhoodSpecs } from 'src/particles/neighborhoods'

interface Props {
  onRotatingChange: (rotating: boolean) => void
  onOptionsChange: (options: Options) => void
}

interface State {
  rotating: boolean
  options: Options
}

const BEHAVIOR_PRESETS: { [name in BehaviorSpecs['name']]: BehaviorSpecs } = {
  none: {
    name: 'none',
    config: {},
  },
  diffusion: {
    name: 'diffusion',
    config: {
      charge: 50,
    },
  },
  wandering: {
    name: 'wandering',
    config: {
      jitter: 0.01,
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
      rotating: true,
      options: {
        dimensions: 3,
        particles: 9,
        max: {
          force: 1,
          speed: 1,
        },
        behavior: BEHAVIOR_PRESETS.wandering,
        neighborhood: NEIGHBORHOOD_PRESETS.nearest,
        boundings: {
          centering: false,
          scaling: false,
          centerScaling: true,
          binding: false,
          wrapping: false,
        },
        layers: {
          points: true,
          lines: true,
          circles: true,
          spheres: true,
          bounds: false,
          grid: true,
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
            value={this.state.options.dimensions}
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
            value={this.state.options.particles}
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
              checked={this.state.options.layers.points}
              onChange={this.handleLayers}
            />
            &nbsp; 0D &mdash; Points
          </label>
          <label>
            <input
              type="checkbox"
              name="lines"
              checked={this.state.options.layers.lines}
              onChange={this.handleLayers}
            />
            &nbsp; 1D &mdash; Lines
          </label>
          <label>
            <input
              type="checkbox"
              name="circles"
              checked={this.state.options.layers.circles}
              onChange={this.handleLayers}
            />
            &nbsp; 2D &mdash; Circles
          </label>
          <label>
            <input
              type="checkbox"
              name="spheres"
              checked={this.state.options.layers.spheres}
              onChange={this.handleLayers}
            />
            &nbsp; 3D &mdash; Spheres
          </label>
          <label>
            <input
              type="checkbox"
              name="bounds"
              checked={this.state.options.layers.bounds}
              onChange={this.handleLayers}
            />
            &nbsp; Bounds
          </label>
          <label>
            <input
              type="checkbox"
              name="grid"
              checked={this.state.options.layers.grid}
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
              name="none"
              checked={this.state.options.behavior.name === 'none'}
              onChange={this.handleBehaviors}
            />
            &nbsp; None
          </label>
          <label>
            <input
              type="radio"
              name="wandering"
              checked={this.state.options.behavior.name === 'wandering'}
              onChange={this.handleBehaviors}
            />
            &nbsp; Wandering
          </label>
          <label>
            <input
              type="radio"
              name="diffusion"
              checked={this.state.options.behavior.name === 'diffusion'}
              onChange={this.handleBehaviors}
            />
            &nbsp; Diffusion
          </label>
        </div>
        <hr />
        <div>
          Neighbors
          <label>
            <input
              type="radio"
              name="nearest"
              checked={this.state.options.neighborhood.name === 'nearest'}
              onChange={this.handleNeighborhoods}
            />
            &nbsp; Nearest
          </label>
          <label>
            <input
              type="radio"
              name="locals"
              checked={this.state.options.neighborhood.name === 'locals'}
              onChange={this.handleNeighborhoods}
            />
            &nbsp; Locals
          </label>
          <label>
            <input
              type="radio"
              name="all"
              checked={this.state.options.neighborhood.name === 'all'}
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
              name="centerScaling"
              checked={this.state.options.boundings.centerScaling}
              onChange={this.handleBoundings}
            />
            &nbsp; Center-Scaling
          </label>
          <label>
            <input
              type="checkbox"
              name="centering"
              checked={this.state.options.boundings.centering}
              onChange={this.handleBoundings}
            />
            &nbsp; Centering
          </label>
          <label>
            <input
              type="checkbox"
              name="scaling"
              checked={this.state.options.boundings.scaling}
              onChange={this.handleBoundings}
            />
            &nbsp; Scaling
          </label>
          <label>
            <input
              type="checkbox"
              name="binding"
              checked={this.state.options.boundings.binding}
              onChange={this.handleBoundings}
            />
            &nbsp; Binding
          </label>
        </div>
      </div>
    )
  }

  public getOptions(): Options {
    return this.state.options
  }

  public getRotating(): boolean {
    return this.state.rotating
  }

  private handleDimensions = (e: React.FormEvent<HTMLInputElement>) => {
    const options = { ...this.state.options }
    options.dimensions = Number(e.currentTarget.value)
    this.props.onOptionsChange(options)
    this.setState({ options })
  }

  private handleParticles = (e: React.FormEvent<HTMLInputElement>) => {
    const options = { ...this.state.options }
    const particles = Number(e.currentTarget.value)
    options.particles = Math.min(particles, MAX_PARTICLES)
    this.props.onOptionsChange(options)
    this.setState({ options })
  }

  private handleLayers = (e: React.FormEvent<HTMLInputElement>) => {
    const options = { ...this.state.options }
    const name = e.currentTarget.name as LayerName
    const value = e.currentTarget.checked
    options.layers[name] = value
    this.props.onOptionsChange(options)
    this.setState({ options })
  }

  private handleBoundings = (e: React.FormEvent<HTMLInputElement>) => {
    const options = { ...this.state.options }
    const name = e.currentTarget.name as BoundingName
    const value = e.currentTarget.checked
    options.boundings[name] = value
    this.props.onOptionsChange(options)
    this.setState({ options })
  }

  private handleBehaviors = (e: React.FormEvent<HTMLInputElement>) => {
    const options = { ...this.state.options }
    const name = e.currentTarget.name as LayerName
    const spec = BEHAVIOR_PRESETS[name as BehaviorSpecs['name']]
    options.behavior = spec
    this.props.onOptionsChange(options)
    this.setState({ options })
  }

  private handleNeighborhoods = (e: React.FormEvent<HTMLInputElement>) => {
    const options = { ...this.state.options }
    const name = e.currentTarget.name as LayerName
    const spec = NEIGHBORHOOD_PRESETS[name as NeighborhoodSpecs['name']]
    options.neighborhood = spec
    this.props.onOptionsChange(options)
    this.setState({ options })
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
