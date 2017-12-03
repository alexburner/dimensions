declare module 'worker-loader!*' {
  class WorkerLoader extends Worker {
    constructor()
  }

  export = WorkerLoader
}

declare module 'three-trackballcontrols' {
  class TrackballControls extends Worker {
    constructor(camera: THREE.Camera, canvas: HTMLCanvasElement)
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

/**
 * XXX: stolen from node_modules/typescript/lib/lib.webworker.d.ts
 * because currently tsconfig lib cannot load both DOM and WebWorker
 * (lots of "Duplicate Identifier" errors)
 */

interface WorkerGlobalScopeEventMap {
  error: ErrorEvent
}

interface WorkerGlobalScope
  extends EventTarget,
    WorkerUtils,
    WindowConsole,
    GlobalFetch {
  readonly caches: CacheStorage
  readonly isSecureContext: boolean
  readonly location: WorkerLocation
  onerror: (this: WorkerGlobalScope, ev: ErrorEvent) => any
  readonly performance: Performance
  readonly self: WorkerGlobalScope
  msWriteProfilerMark(profilerMarkName: string): void
  addEventListener<K extends keyof WorkerGlobalScopeEventMap>(
    type: K,
    listener: (
      this: WorkerGlobalScope,
      ev: WorkerGlobalScopeEventMap[K],
    ) => any,
    useCapture?: boolean,
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    useCapture?: boolean,
  ): void
}

declare var WorkerGlobalScope: {
  prototype: WorkerGlobalScope
  new (): WorkerGlobalScope
}

interface DedicatedWorkerGlobalScopeEventMap extends WorkerGlobalScopeEventMap {
  message: MessageEvent
}

interface DedicatedWorkerGlobalScope extends WorkerGlobalScope {
  onmessage: (this: DedicatedWorkerGlobalScope, ev: MessageEvent) => any
  close(): void
  postMessage<T>(message: T, transfer?: any[]): void
  addEventListener<K extends keyof DedicatedWorkerGlobalScopeEventMap>(
    type: K,
    listener: (
      this: DedicatedWorkerGlobalScope,
      ev: DedicatedWorkerGlobalScopeEventMap[K],
    ) => any,
    useCapture?: boolean,
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    useCapture?: boolean,
  ): void
}

declare var DedicatedWorkerGlobalScope: {
  prototype: DedicatedWorkerGlobalScope
  new (): DedicatedWorkerGlobalScope
}

interface WorkerLocation {
  readonly hash: string
  readonly host: string
  readonly hostname: string
  readonly href: string
  readonly origin: string
  readonly pathname: string
  readonly port: string
  readonly protocol: string
  readonly search: string
  toString(): string
}

declare var WorkerLocation: {
  prototype: WorkerLocation
  new (): WorkerLocation
}

interface WorkerNavigator
  extends Object,
    NavigatorID,
    NavigatorOnLine,
    NavigatorBeacon,
    NavigatorConcurrentHardware {
  readonly hardwareConcurrency: number
}

declare var WorkerNavigator: {
  prototype: WorkerNavigator
  new (): WorkerNavigator
}

interface WorkerUtils extends Object, WindowBase64 {
  readonly indexedDB: IDBFactory
  readonly msIndexedDB: IDBFactory
  readonly navigator: WorkerNavigator
  clearImmediate(handle: number): void
  clearInterval(handle: number): void
  clearTimeout(handle: number): void
  importScripts(...urls: string[]): void
  setImmediate(handler: (...args: any[]) => void): number
  setImmediate(handler: any, ...args: any[]): number
  setInterval(handler: (...args: any[]) => void, timeout: number): number
  setInterval(handler: any, timeout?: any, ...args: any[]): number
  setTimeout(handler: (...args: any[]) => void, timeout: number): number
  setTimeout(handler: any, timeout?: any, ...args: any[]): number
}
