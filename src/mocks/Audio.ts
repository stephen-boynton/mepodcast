// mock Audio class

interface AudioMock extends HTMLAudioElement {
  duration: number
  paused: boolean
  src: string
  play: () => Promise<void>
  pause: () => void
  buffered: {
    length: number
    start: (index: number) => number
    end: (index: number) => number
  }
}

export const audioMock = jest
  .fn()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .mockImplementation() as unknown as jest.Mocked<AudioMock>
