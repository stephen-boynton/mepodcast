export class Logger {
  static log(...messages: string[]) {
    console.log(...messages)
  }

  static error(message: string) {
    console.error(message)
  }

  static warn(message: string) {
    console.warn(message)
  }
}
