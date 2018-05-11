import * as React from 'react'

import { MAX_PARTICLES } from 'src/constants'
import { LayerName } from 'src/drawing/layers'
import { Options } from 'src/options'
import { BehaviorSpecs } from 'src/particles/behaviors'
import { BoundingName } from 'src/particles/boundings'
import { NeighborhoodSpecs } from 'src/particles/System'

interface Props {
  onRotatingChange: (rotating: boolean) => void
  onOptionsChange: (options: Options) => void
}

interface State {
  closed: boolean
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
  gravity: {
    name: 'gravity',
    config: {
      charge: -1,
      mass: 5,
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
      closed: false,
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
        bounding: 'centerScaling',
        layers: {
          points: true,
          lines: true,
          circles: true,
          spheres: true,
          bounds: false,
          grid: true,
          trails: false,
        },
      },
    }
  }

  public render() {
    return (
      <div className={'controls' + (this.state.closed ? ' is-closed' : '')}>
        <div className="toggle" onClick={this.handleToggle}>
          {/* http://graphemica.com/search?q=triangle */}
          {this.state.closed ? '\u25C0' : '\u25B6'}
        </div>
        <div className="scroll">
          <div className="inner">
            <header>dimensions</header>
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
                value={this.state.options.particles}
                onChange={this.handleParticles}
                onKeyDown={this.handleEnter}
              />
              &nbsp; Particles
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
                value={this.state.options.dimensions}
                onChange={this.handleDimensions}
                onKeyDown={this.handleEnter}
              />
              &nbsp; Dimensions
            </label>
            <label>
              <input
                type="checkbox"
                checked={this.state.rotating}
                onChange={this.handleRotating}
              />
              &nbsp; Rotating
            </label>
            <hr />
            <div>
              Render layers
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
                  name="trails"
                  checked={this.state.options.layers.trails}
                  onChange={this.handleLayers}
                />
                &nbsp; Trails
              </label>
            </div>
            <hr />
            <div>
              Particle behavior
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
              <label>
                <input
                  type="radio"
                  name="none"
                  checked={this.state.options.behavior.name === 'none'}
                  onChange={this.handleBehaviors}
                />
                &nbsp; None
              </label>
            </div>
            <hr />
            <div>
              Boundary behavior
              <label>
                <input
                  type="radio"
                  name="centerScaling"
                  checked={this.state.options.bounding === 'centerScaling'}
                  onChange={this.handleBoundings}
                />
                &nbsp; Center-scaling
              </label>
              <label>
                <input
                  type="radio"
                  name="binding"
                  checked={this.state.options.bounding === 'binding'}
                  onChange={this.handleBoundings}
                />
                &nbsp; Edge-binding
              </label>
              <label>
                <input
                  type="radio"
                  name="none"
                  checked={this.state.options.bounding === 'none'}
                  onChange={this.handleBoundings}
                />
                &nbsp; None
              </label>
            </div>
            <hr />
            <div>
              Neighbor relations
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
                &nbsp; Local
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
          </div>
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

  private handleToggle = () => {
    this.setState({ closed: !this.state.closed })
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
    options.bounding = name
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
