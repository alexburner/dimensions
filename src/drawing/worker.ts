const context: Worker = self as any
context.addEventListener('message', e => {
  console.log('Worker message', e)
  context.postMessage({ bar: 'foo' })
})
