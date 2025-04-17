import { createEpisode, Episode } from './Episode'
import { PodcastPlayer } from './Player'
import { audioMock } from '../mocks/Audio'
import { episodeMock } from '@/mocks/episodes'
import { ProgressService } from '@/services/ProgressService'
import { createProgress } from './Progress'

describe('PodcastPlayer', () => {
  let player: PodcastPlayer

  beforeEach(() => {
    player = PodcastPlayer.create(audioMock, jest.fn(), jest.fn(), jest.fn())
    player.clear()
    jest.restoreAllMocks()
  })

  it('Create: should create a player', () => {
    expect(player).toBeDefined()
  })

  it('Create: should return same player instance', () => {
    const player2 = PodcastPlayer.create(
      audioMock,
      jest.fn(),
      jest.fn(),
      jest.fn()
    )
    expect(player).toEqual(player2)
  })

  it('Initialize: should initialize a player', async () => {
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

  it('Initialize: should not initialize a player if no episode is provided', async () => {
    await player.initialize(undefined as unknown as Episode)
    expect(player.isInitialized).toBe(false)
  })

  it('Play: should play an episode', async () => {
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

  it('Play: should play current episode with no episode provided', async () => {
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

  it('Play: should abort if no episode is provided and no current episode is loaded', async () => {
    jest.spyOn(player, 'isLoaded').mockReturnValue(false)
    player.currentEpisode = undefined
    await player.play()
    expect(player.onPlayStateChange).not.toHaveBeenCalled()
  })

  it('Play: should not play an episode if it is already playing', async () => {
    const ep = createEpisode({
      uuid: '123',
      audioUrl: 'https://example.com/audio.mp3'
    })
    player.currentEpisode = ep
    await player.play(ep)
    expect(player.onPlayStateChange).not.toHaveBeenCalled()
  })

  it('Load: should load an episode', async () => {
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

  it('Load: should not load an episode if no episode is provided', async () => {
    await player.load()
    expect(player.onLoadedChange).not.toHaveBeenCalled()
  })

  it('Pause: should pause a player', () => {
    audioMock.pause = jest.fn().mockImplementation(() => {
      audioMock.paused = true
    })
    player.pause()
    expect(player.isPlaying).toBe(false)
  })

  it('Stop: should stop a player', () => {
    player.stop()
    expect(player.isPlaying).toBe(false)
  })

  it.skip('Download: should download an episode', () => {
    expect(player).toBeDefined()
  })

  it('CurrentTime: should get the current time', () => {
    expect(player.currentTime).toBe(0)
  })

  it('Duration: should get the duration', () => {
    audioMock.duration = 100
    expect(player.getDuration()).toBe(100)
  })

  it('IsLoaded: should get the isLoaded', () => {
    audioMock.buffered = {
      length: 1,
      start: jest.fn(),
      end: jest.fn()
    }
    expect(player.isLoaded()).toBe(true)
  })

  it('IsPaused: should get the isPaused', () => {
    audioMock.paused = false
    expect(player.isPaused()).toBe(false)
  })

  it('Complete: should complete an episode', async () => {
    await player.load(episodeMock)
    audioMock.duration = 100
    await player.complete()
    expect(player.currentTime).toBe(100)
    expect(player.onPlayStateChange).toHaveBeenCalledWith(false)
  })

  it('currentProgress: should get the current progress', async () => {
    jest.spyOn(ProgressService, 'getProgress').mockResolvedValue(
      createProgress({
        completed: false,
        episodeProgress: 123,
        episodeUuid: '123',
        seriesUuid: '456'
      })
    )

    await player.load(episodeMock)

    const progress = await player.currentTime
    expect(progress).toEqual(123)
  })

  it('currentProgress: should create progress from dto', async () => {
    // @ts-expect-error mock
    jest.spyOn(ProgressService, 'getProgress').mockResolvedValue({
      completed: false,
      episodeProgress: 123,
      episodeUuid: '123',
      id: 1,
      seriesUuid: '456'
    })

    await player.load(episodeMock)

    const progress = await player.currentTime
    expect(progress).toEqual(123)
  })

  it('SaveProgress: should save progress', async () => {
    jest.spyOn(ProgressService, 'updateProgress')

    await player.load(
      createEpisode({
        uuid: '123',
        audioUrl: 'https://example.com/audio.mp3'
      })
    )
    await player.saveProgress()
    expect(ProgressService.updateProgress).toHaveBeenCalledWith({
      completed: false,
      episodeProgress: 0,
      episodeUuid: '123',
      id: 1,
      seriesUuid: null
    })
  })

  it('CurrentTime: should set the current time', () => {
    player.currentTime = 100
    expect(player.currentTime).toBe(100)
  })

  it('Src: should set the src', () => {
    player.src = 'https://example.com/audio.mp3'
    expect(player.src).toBe('https://example.com/audio.mp3')
  })
})
