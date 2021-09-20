module.exports = {
  name: 'error',
  execute (error) {
    console.log('Ignoring uncaught exception:\n' + error)
  }
}
