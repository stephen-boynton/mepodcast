/* eslint-disable @typescript-eslint/no-explicit-any */
export class Logger {
  static log(...messages: any[]) {
    console.log(...messages)
  }

  static error(message: string) {
    console.error(message)
  }

  static warn(...message: any[]) {
    console.warn(message)
  }

  static debug(...message: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(message)
    }
  }
}
