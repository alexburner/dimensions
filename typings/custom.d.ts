declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor()
  }

  export = WebpackWorker
}

declare module 'three-trackballcontrols' {
  class TrackballControls extends Worker {
    constructor(
      camera: THREE.Camera,
      canvas: HTMLCanvasElement,
    )
    handleResize(): void
    update(): void
  }

  export = TrackballControls
}
