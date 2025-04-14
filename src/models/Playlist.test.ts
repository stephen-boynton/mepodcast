// make a test for the Playlist model

import { initializePlaylist, Playlist } from '@/models/Playlist'
import { FALSE } from '@/db/constants'
import { Episode } from '@/models/Episode'

const episode1 = new Episode({
  uuid: '123',
  name: 'Test Episode 1',
  audioUrl: 'https://example.com/test-episode1.mp3',
  duration: 100,
  datePublished: new Date().getTime(),
  description: 'Test Description',
  imageUrl: 'https://example.com/test-episode1.jpg'
})

const episode2 = new Episode({
  uuid: '456',
  name: 'Test Episode 2',
  audioUrl: 'https://example.com/test-episode2.mp3',
  duration: 100,
  datePublished: new Date().getTime(),
  description: 'Test Description',
  imageUrl: 'https://example.com/test-episode2.jpg'
})

describe('Playlist', () => {
  it('should create a playlist', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [],
      cursor: 0,
      isAutoPlaylist: FALSE,
      isCurrentPlaylist: FALSE
    })

    expect(playlist.name).toBe('Test Playlist')
    expect(playlist.episodes).toEqual([])
    expect(playlist.cursor).toBe(0)
    expect(playlist.isAutoPlaylist).toBe(FALSE)
    expect(playlist.isCurrentPlaylist).toBe(FALSE)
  })

  it('should not set cursor to negative', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [],
      cursor: -1
    })

    expect(playlist.cursor).toBe(0)
  })

  it('should add an episode to the playlist', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [],
      cursor: 0,
      isAutoPlaylist: FALSE,
      isCurrentPlaylist: FALSE
    })

    const episode = new Episode({
      uuid: '123',
      name: 'Test Episode',
      audioUrl: 'https://example.com/test-episode.mp3',
      duration: 100,
      datePublished: new Date().getTime(),
      description: 'Test Description',
      imageUrl: 'https://example.com/test-episode.jpg'
    })

    playlist.addEpisodeToPlaylist(episode)

    expect(playlist.episodes).toEqual([episode])
  })

  it('should add episode as currently playing', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [],
      cursor: 0,
      isAutoPlaylist: FALSE,
      isCurrentPlaylist: FALSE
    })

    const episode = new Episode({
      uuid: '123',
      name: 'Test Episode',
      audioUrl: 'https://example.com/test-episode.mp3',
      duration: 100,
      datePublished: new Date().getTime(),
      description: 'Test Description',
      imageUrl: 'https://example.com/test-episode.jpg'
    })

    playlist.addAsCurrentlyPlaying(episode)

    expect(playlist.episodes[0]).toEqual(episode)
    expect(playlist.cursor).toBe(0)
  })

  it('should add episode as play next', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [
        new Episode({
          uuid: '123',
          name: 'Already in playlist',
          audioUrl: 'https://example.com/already-in-playlist.mp3',
          duration: 100,
          datePublished: new Date().getTime(),
          description: 'Test Description',
          imageUrl: 'https://example.com/already-in-playlist.jpg'
        })
      ],
      cursor: 0
    })

    const episode = new Episode({
      uuid: '321',
      name: 'Test Episode',
      audioUrl: 'https://example.com/test-episode.mp3',
      duration: 100,
      datePublished: new Date().getTime(),
      description: 'Test Description',
      imageUrl: 'https://example.com/test-episode.jpg'
    })

    playlist.addAsPlayNext(episode)
    console.log({ playlist })
    expect(playlist.episodes[1]).toEqual(episode)
  })

  it('should move exisiting episode to play next', () => {
    const existing = new Episode({
      uuid: '789',
      name: 'Test Episode 3',
      audioUrl: 'https://example.com/test-episode3.mp3'
    })

    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [
        new Episode({
          uuid: '123',
          name: 'Test Episode',
          audioUrl: 'https://example.com/test-episode.mp3'
        }),
        new Episode({
          uuid: '456',
          name: 'Test Episode 2',
          audioUrl: 'https://example.com/test-episode2.mp3'
        }),
        existing
      ],
      cursor: 0
    })

    playlist.addAsPlayNext(existing)
    expect(playlist.episodes[1]).toEqual(existing)
  })

  it('should not add episode as play next if it finds it has but then cannot find it', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [episode1, episode2],
      cursor: 0
    })

    playlist.alreadyHasEpisode = () => true

    const episode3 = new Episode({
      uuid: '9999',
      name: 'Test Episode',
      audioUrl: 'https://example.com/test-episode.mp3'
    })

    playlist.addAsPlayNext(episode3)

    expect(
      playlist.episodes.find((e) => e.uuid === episode3.uuid)
    ).toBeUndefined()
  })

  it('should add episode as first when playlist is empty', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [],
      cursor: 0
    })

    const episode = new Episode({
      uuid: '123',
      name: 'Test Episode',
      audioUrl: 'https://example.com/test-episode.mp3',
      duration: 100,
      datePublished: new Date().getTime(),
      description: 'Test Description',
      imageUrl: 'https://example.com/test-episode.jpg'
    })

    playlist.addAsPlayNext(episode)
    expect(playlist.episodes[0]).toEqual(episode)
  })

  it('should not add duplicate episodes', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [],
      cursor: 0,
      isAutoPlaylist: FALSE,
      isCurrentPlaylist: FALSE
    })

    const episode = new Episode({
      uuid: '123',
      name: 'Test Episode',
      audioUrl: 'https://example.com/test-episode.mp3',
      duration: 100,
      datePublished: new Date().getTime(),
      description: 'Test Description',
      imageUrl: 'https://example.com/test-episode.jpg'
    })

    playlist.addEpisodeToPlaylist(episode)
    playlist.addEpisodeToPlaylist(episode)

    expect(playlist.episodes.length).toBe(1)
  })

  it('should remove an episode from the playlist', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [],
      cursor: 0,
      isAutoPlaylist: FALSE,
      isCurrentPlaylist: FALSE
    })

    const episode = new Episode({
      uuid: '123',
      name: 'Test Episode',
      audioUrl: 'https://example.com/test-episode.mp3',
      duration: 100,
      datePublished: new Date().getTime(),
      description: 'Test Description',
      imageUrl: 'https://example.com/test-episode.jpg'
    })

    playlist.addEpisodeToPlaylist(episode)
    playlist.removeEpisodeFromPlaylist('123')

    expect(playlist.episodes).toEqual([])
  })

  it('should clear the playlist', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [],
      cursor: 0,
      isAutoPlaylist: FALSE,
      isCurrentPlaylist: FALSE
    })

    const episode = new Episode({
      uuid: '123',
      name: 'Test Episode',
      audioUrl: 'https://example.com/test-episode.mp3',
      duration: 100,
      datePublished: new Date().getTime(),
      description: 'Test Description',
      imageUrl: 'https://example.com/test-episode.jpg'
    })

    playlist.addEpisodeToPlaylist(episode)
    playlist.clearPlaylist()

    expect(playlist.episodes).toEqual([])
  })

  it('should change episode order', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [],
      cursor: 0,
      isAutoPlaylist: FALSE,
      isCurrentPlaylist: FALSE
    })

    playlist.addEpisodeToPlaylist(episode1)
    playlist.addEpisodeToPlaylist(episode2)
    playlist.changeEpisodeOrder('456', 0)

    expect(playlist.episodes[0]).toEqual(episode2)
    expect(playlist.episodes[1]).toEqual(episode1)
  })

  it('should get current episode', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [],
      cursor: 0,
      isAutoPlaylist: FALSE,
      isCurrentPlaylist: FALSE
    })

    const episode = new Episode({
      uuid: '123',
      name: 'Test Episode',
      audioUrl: 'https://example.com/test-episode.mp3',
      duration: 100,
      datePublished: new Date().getTime(),
      description: 'Test Description',
      imageUrl: 'https://example.com/test-episode.jpg'
    })

    playlist.addEpisodeToPlaylist(episode)
    playlist.addEpisodeToPlaylist(episode2)

    expect(playlist.getCurrent()).toEqual(episode)
  })

  it('should get next episode', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [],
      cursor: 0,
      isAutoPlaylist: FALSE,
      isCurrentPlaylist: FALSE
    })

    playlist.addEpisodeToPlaylist(episode1)
    playlist.addEpisodeToPlaylist(episode2)
    const next = playlist.getNext()

    expect(playlist.cursor).toBe(1)
    expect(next).toEqual(episode2)
    expect(playlist.getCurrent()).toEqual(episode2)
  })

  it('should get previous episode', () => {
    const episode2 = new Episode({
      uuid: '456',
      name: 'Test Episode 2',
      audioUrl: 'https://example.com/test-episode2.mp3'
    })

    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [episode1, episode2],
      cursor: 0
    })

    const previous = playlist.getPrevious()

    expect(previous).toEqual(episode1)
    expect(playlist.getCurrent()).toEqual(episode1)
  })

  it('should stay on first episode when getting previous', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [episode1, episode2],
      cursor: 0
    })

    const previous = playlist.getPrevious()

    expect(previous).toEqual(episode1)
    expect(playlist.getCurrent()).toEqual(episode1)
  })

  it('should rewrite list and maintain current episode', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [episode1, episode2],
      cursor: 0
    })

    playlist.rewriteList([episode2, episode1])

    expect(playlist.episodes[0]).toEqual(episode2)
    expect(playlist.episodes[1]).toEqual(episode1)
    expect(playlist.cursor).toBe(1)
  })

  it('should format to dto', () => {
    const playlist = new Playlist({
      name: 'Test Playlist',
      episodes: [episode1, episode2],
      cursor: 0
    })

    const dto = playlist.toDto()

    expect(dto.name).toBe('Test Playlist')
    expect(dto.episodes.length).toBe(2)
    expect(dto.cursor).toBe(0)
  })
})

describe('initializePlaylist', () => {
  it('should initialize playlist', () => {
    const playlist = initializePlaylist({
      name: 'Test Playlist',
      episodes: [episode1.toDto(), episode2.toDto()],
      cursor: 0
    })

    expect(playlist.name).toBe('Test Playlist')
    expect(playlist.episodes.length).toBe(2)
    expect(playlist.cursor).toBe(0)
  })

  it('should initialize without episodes', () => {
    const playlist = initializePlaylist({
      name: 'Test Playlist',
      cursor: 0
    })

    expect(playlist.name).toBe('Test Playlist')
    expect(playlist.episodes.length).toBe(0)
    expect(playlist.cursor).toBe(0)
  })
})
