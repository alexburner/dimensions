// Handle browser messages
self.addEventListener('message', e => {
    console.log('Worker message', e)
    self.postMessage({ bar: 'foo' }, undefined)
})