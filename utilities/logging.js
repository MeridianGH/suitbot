export class logging {
  static error(message) { console.error('%s \x1b[31m%s\x1b[0m', this.time(), message) }
  static warn(message) { console.warn('%s \x1b[33m%s\x1b[0m', this.time(), message) }
  static info(message) { console.info('%s \x1b[36m%s\x1b[0m', this.time(), message) }
  static success(message) { console.log('%s \x1b[32m%s\x1b[0m', this.time(), message) }

  static time() {
    const now = new Date()
    return `[${now.toLocaleTimeString()}]`
  }
}
