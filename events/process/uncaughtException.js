module.exports = {
  name: 'uncaughtException',
  execute (error) {
    console.log(`Ignoring uncaught exception: ${error} | ${error.stack.split(/\r?\n/)[1].split('\\').pop().slice(0, -1)}`)
  }
}
