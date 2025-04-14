// make a test for the Episode model

import { createEpisode, Episode } from '@/models/Episode'

const episode = new Episode({
  uuid: '123',
  name: 'Test Episode',
  audioUrl: 'https://example.com/test-episode.mp3',
  duration: 100,
  datePublished: 1111111111,
  description: 'Test Description',
  series: {
    uuid: '456',
    name: 'Test Series',
    imageUrl: 'https://example.com/test-series.jpg',
    authorName: 'Test Author'
  },
  seriesName: 'Test Series',
  seriesUuid: '456',
  seasonNumber: 1,
  episodeNumber: 1,
  listens: 100,
  completed: 0
})

describe('Episode', () => {
  it('should create an episode', () => {
    expect(episode.uuid).toBe('123')
    expect(episode.name).toBe('Test Episode')
    expect(episode.audioUrl).toBe('https://example.com/test-episode.mp3')
    expect(episode.duration).toBe(100)
    expect(episode.datePublished).toBe(1111111111)
    expect(episode.description).toBe('Test Description')
    expect(episode.imageUrl).toBe('https://example.com/test-series.jpg')
  })

  it('should create an episode from a dto', () => {
    const _episode = new Episode(episode.toDto())

    expect(_episode.seriesUuid).toBe('456')
    expect(_episode.seriesName).toBe('Test Series')
    expect(_episode.authorName).toBe('Test Author')
    expect(_episode.imageUrl).toBe('https://example.com/test-series.jpg')

    const _episode2 = new Episode({
      uuid: '123',
      name: 'Test Episode',
      audioUrl: 'https://example.com/test-episode.mp3',
      duration: 100,
      datePublished: 1111111111,
      description: 'Test Description',
      series: undefined
    })

    expect(_episode2.seriesUuid).toBeNull()
    expect(_episode2.seriesName).toBeNull()
    expect(_episode2.authorName).toBeNull()
  })

  it('should create an episode with no image', () => {
    const episode = new Episode({
      uuid: '123',
      name: 'Test Episode',
      audioUrl: 'https://example.com/test-episode.mp3',
      duration: 100,
      datePublished: 1111111111,
      description: 'Test Description'
    })

    expect(episode.imageUrl).toBeNull()
  })

  it('should create an episode with no series', () => {
    const episode = new Episode({
      uuid: '123',
      name: 'Test Episode',
      audioUrl: 'https://example.com/test-episode.mp3',
      duration: 100,
      datePublished: 1111111111,
      description: 'Test Description'
    })

    expect(episode.seriesName).toBeNull()
    expect(episode.seriesUuid).toBeNull()
  })

  it('should create an episode with no listens', () => {
    const episode = new Episode({
      uuid: '123',
      name: 'Test Episode',
      audioUrl: 'https://example.com/test-episode.mp3',
      duration: 100,
      datePublished: 1111111111,
      description: 'Test Description'
    })

    expect(episode.listens).toBeNull()
  })

  it('should return true if the episode is playable', () => {
    expect(Episode.isPlayable(episode)).toBe(true)
  })

  it('should return false if the episode is not playable', () => {
    expect(Episode.isPlayable({})).toBe(false)
  })

  it('should format to dto', () => {
    const dto = episode.toDto()

    expect(dto.uuid).toBe('123')
    expect(dto.name).toBe('Test Episode')
    expect(dto.audioUrl).toBe('https://example.com/test-episode.mp3')
  })
})

describe('createEpisode', () => {
  it('should create an episode', () => {
    const _episode = createEpisode(episode.toDto())

    expect(_episode.uuid).toBe('123')
    expect(_episode.name).toBe('Test Episode')
    expect(_episode.audioUrl).toBe('https://example.com/test-episode.mp3')
    expect(_episode.duration).toBe(100)
    expect(_episode.datePublished).toBe(1111111111)
    expect(_episode.description).toBe('Test Description')
    expect(_episode.imageUrl).toBe('https://example.com/test-series.jpg')
  })
})
