declare module 'worker-loader!*' {
  class WorkerLoader extends Worker {
    constructor()
  }

  export = WorkerLoader
}

declare module 'three-trackballcontrols' {
  class TrackballControls extends Worker {
    constructor(
      camera: THREE.Camera,
      canvas: HTMLCanvasElement,
    )
    handleResize(): void
    update(): void
    rotateSpeed: number
    zoomSpeed: number
    panSpeed: number
    noRotate: boolean
    noZoom: boolean
    noPan: boolean
    staticMoving: boolean
    dynamicDampingFactor: number
    minDistance: number
    maxDistance: number
  }

  export = TrackballControls
}
