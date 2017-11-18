import WorkerLoader from 'worker-loader!src/worker'

export default class Main {
    private worker: Worker

    constructor() {
        this.worker = new WorkerLoader()
        this.worker.addEventListener('message', e => {
            console.log('Main worker message', e)
        })
        this.worker.postMessage({ foo: 'bar' })
    }
}
