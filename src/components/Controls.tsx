import * as React from 'react'

import { WorkerRequest } from 'src/interfaces'

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
    this.state = { request: props.request }
  }

  public render() {
    return (
      <div>I am controls</div>
    )
  }
}
