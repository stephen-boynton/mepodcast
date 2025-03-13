export class Logger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static log(...messages: any[]) {
    console.log(...messages)
  }

  static error(message: string) {
    console.error(message)
  }

  static warn(message: string) {
    console.warn(message)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static debug(...message: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(message)
    }
  }
}
