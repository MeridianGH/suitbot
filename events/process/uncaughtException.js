module.exports = {
  name: 'uncaughtException',
  execute (error) {
    console.log('Ignoring uncaught exception: ' + error)
  }
}