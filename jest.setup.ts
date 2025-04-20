/* eslint-disable @typescript-eslint/no-require-imports */
import 'fake-indexeddb/auto'
import '@testing-library/jest-dom'

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))
