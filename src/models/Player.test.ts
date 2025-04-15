import { createEpisode } from './Episode'
import { PodcastPlayer } from './Player'
import { audioMock } from '../mocks/Audio'

describe('PodcastPlayer', () => {
  const player = PodcastPlayer.create(
    audioMock,
    jest.fn(),
    jest.fn(),
    jest.fn()
  )

  beforeEach(() => {
    player.clear()
    jest.restoreAllMocks()
  })

  it('should create a player', () => {
    expect(player).toBeDefined()
  })

  it('initialize: should initialize a player', async () => {
    audioMock.load = jest.fn()
    jest.spyOn(player, 'onLoadedChange')
    jest.spyOn(player, 'onSrcChange')
    jest.spyOn(player, 'onPlayStateChange')
    await player.initialize(
      createEpisode({
        uuid: '123',
        audioUrl: 'https://example.com/audio33.mp3',
        authorName: 'John Doe',
        completed: 0,
        datePublished: 1,
        description: 'This is a test episode',
        duration: 100,
        episodeNumber: 1
      })
    )

    expect(player.onLoadedChange).toHaveBeenCalledWith(true)
    expect(player.onSrcChange).toHaveBeenCalledWith(
      'https://example.com/audio33.mp3'
    )
    expect(player.onPlayStateChange).not.toHaveBeenCalled()
    expect(player.isInitialized).toBe(true)
    expect(player.src).toBe('https://example.com/audio33.mp3')
  })

  it('play: should play an episode', async () => {
    audioMock.play = jest.fn()
    jest.spyOn(player, 'isLoaded').mockReturnValue(true)
    jest.spyOn(player, 'load').mockResolvedValue()

    await player.play(
      createEpisode({
        uuid: '123',
        audioUrl: 'https://example.com/audio.mp3'
      })
    )

    expect(player.onPlayStateChange).toHaveBeenCalledWith(true)
  })

  it('play: should play current episode with no episode provided', async () => {
    audioMock.play = jest.fn()
    jest.spyOn(player, 'isLoaded').mockReturnValue(true)
    audioMock.buffered = {
      length: 1,
      start: jest.fn(),
      end: jest.fn()
    }

    player.currentEpisode = createEpisode({
      uuid: '123',
      audioUrl: 'https://example.com/audio.mp3'
    })

    await player.play()
    expect(player.onPlayStateChange).toHaveBeenCalledWith(true)
  })

  it('load: should load an episode', async () => {
    audioMock.load = jest.fn().mockResolvedValue(true)

    await player.load(
      createEpisode({
        uuid: '123',
        audioUrl: 'https://example.com/audio17.mp3'
      })
    )

    expect(audioMock.load).toHaveBeenCalledWith()
    expect(player.onLoadedChange).toHaveBeenCalledWith(true)
    expect(player.onSrcChange).toHaveBeenCalledWith(
      'https://example.com/audio17.mp3'
    )
  })

  it('pause: should pause a player', () => {
    audioMock.pause = jest.fn().mockImplementation(() => {
      audioMock.paused = true
    })
    player.pause()
    expect(player.isPlaying).toBe(false)
  })

  it('stop: should stop a player', () => {
    player.stop()
    expect(player.isPlaying).toBe(false)
  })

  it.skip('download: should download an episode', () => {
    expect(player).toBeDefined()
  })

  it('currentTime: should get the current time', () => {
    expect(player.currentTime).toBe(0)
  })

  it('duration: should get the duration', () => {
    audioMock.duration = 100
    expect(player.getDuration()).toBe(100)
  })

  it('isLoaded: should get the isLoaded', () => {
    audioMock.buffered = {
      length: 1,
      start: jest.fn(),
      end: jest.fn()
    }
    expect(player.isLoaded()).toBe(true)
  })

  it('isPaused: should get the isPaused', () => {
    audioMock.paused = false
    expect(player.isPaused()).toBe(false)
  })
})
