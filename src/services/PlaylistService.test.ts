import { initializePlaylist, Playlist } from '@/models/Playlist'
import { PlaylistService } from '@/services/PlaylistService'
import {
  playlistMock,
  playlistMock2,
  autoPlaylistMock
} from '@/mocks/playlists'
import { getPlaylist } from '@/db/operations/playlist'
import { TRUE } from '@/db/constants'
import { episodesMock } from '@/mocks/episodes'

// Whenever you want a fresh indexedDB
describe('Playlist Operations', () => {
  const playlistName = 'Test Playlist'

  const playlistData: Playlist = {
    ...playlistMock,
    cursor: 0,
    addEpisodeToPlaylist: jest.fn(),
    addAsCurrentlyPlaying: jest.fn(),
    addAsPlayNext: jest.fn(),
    alreadyHasEpisode: jest.fn(),
    changeEpisodeOrder: jest.fn(),
    clearPlaylist: jest.fn(),
    getCurrent: jest.fn(),
    getNext: jest.fn(),
    getPrevious: jest.fn(),
    removeEpisodeFromPlaylist: jest.fn(),
    rewriteList: jest.fn(),
    toDto: playlistMock.toDto
  }

  beforeEach(async () => {
    jest.restoreAllMocks()
    await PlaylistService.deleteAllPlaylists()
  })

  it('createPlaylist:should create a playlist', async () => {
    const playlist = await PlaylistService.createPlaylist(playlistData)
    expect(playlist).toBeDefined()
    expect(playlist.id).toBeDefined()
  })

  it('getPlaylist: should get a playlist', async () => {
    const playlist = await PlaylistService.getPlaylist(1)
    expect(playlist).toBeDefined()
  })

  it('getPlaylist: should get current playlist if no id is provided', async () => {
    await PlaylistService.createPlaylist(playlistData)
    await PlaylistService.setAsCurrentPlaylist(1)
    const playlist = await PlaylistService.getPlaylist()
    expect(playlist).toBeDefined()
  })

  it('getPlaylist: should return null if no playlist is found', async () => {
    const playlist = await PlaylistService.getPlaylist(1)
    expect(playlist).toBeNull()
  })

  it('getPlaylist: should return null if no playlist is found without id', async () => {
    const playlist = await PlaylistService.getPlaylist()
    expect(playlist).toBeNull()
  })

  it('getAutoPlaylist: should get an auto playlist', async () => {
    await PlaylistService.createAutoPlaylist(playlistData)
    const playlist = await PlaylistService.getAutoPlaylist()
    expect(playlist).toBeDefined()
  })

  it('updatePlaylist: should update a playlist', async () => {
    const playlist = await PlaylistService.updatePlaylist(playlistData)
    expect(playlist).toBeDefined()
  })

  it('updatePlaylist: should return null if no id exists for update', async () => {
    const playlist = await PlaylistService.updatePlaylist(
      initializePlaylist({
        ...playlistData,
        episodes: [],
        id: undefined
      })
    )
    expect(playlist).toBeNull()
  })

  it('deletePlaylist: should delete a playlist', async () => {
    await PlaylistService.createPlaylist(playlistData)
    await PlaylistService.deletePlaylist(1)
    const didit = await PlaylistService.getPlaylist(1)
    expect(didit).toBe(null)
  })

  it('deleteAllPlaylists: should delete all playlists', async () => {
    await PlaylistService.bulkCreatePlaylists([playlistMock, playlistMock2])
    await PlaylistService.deleteAllPlaylists()
    const playlists = await PlaylistService.getPlaylists()
    expect(playlists.length).toBe(0)
  })

  it('bulkCreatePlaylists: should create multiple playlists', async () => {
    await PlaylistService.bulkCreatePlaylists([playlistMock, playlistMock2])
    const playlists = await PlaylistService.getPlaylists()
    expect(playlists.length).toBe(2)
    await PlaylistService.deleteAllPlaylists()
    const playlists2 = await PlaylistService.getPlaylists()
    expect(playlists2.length).toBe(0)
  })

  it('setAsCurrentPlaylist: should set a playlist as current', async () => {
    const newList = new Playlist({
      name: playlistName,
      episodes: playlistData.episodes.map((episode) => episode.toDto())
    })
    const createdPlaylist = await PlaylistService.createPlaylist(newList)

    const updatedId = await PlaylistService.setAsCurrentPlaylist(
      createdPlaylist.id!
    )
    const playlist = await PlaylistService.getPlaylist(updatedId)
    expect(playlist?.isCurrentPlaylist).toBe(1)
  })

  it('unsetAsCurrentPlaylist: should unset a playlist as current', async () => {
    await PlaylistService.createPlaylist(playlistData)
    await PlaylistService.setAsCurrentPlaylist(1)
    const current = await PlaylistService.getPlaylist()
    expect(current?.isCurrentPlaylist).toBe(1)
    const id = await PlaylistService.unsetAsCurrentPlaylist()
    const playlist = await PlaylistService.getPlaylist(id!)
    expect(playlist?.isCurrentPlaylist).toBe(0)
  })

  it('unsetAsCurrentPlaylist: should return null if no playlist is found', async () => {
    const id = await PlaylistService.unsetAsCurrentPlaylist()
    expect(id).toBeNull()
  })

  it('getAutoPlaylist: should get an auto playlist', async () => {
    const autoPlaylist = new Playlist({
      ...playlistData,
      episodes: playlistData.episodes.map((episode) => episode.toDto())
    })
    await PlaylistService.createAutoPlaylist(autoPlaylist)
    const playlistRaw = await PlaylistService.getAutoPlaylist()
    expect(playlistRaw).toBeDefined()
  })

  it('createAutoPlaylist: should create an auto playlist', async () => {
    const autoPlaylist = new Playlist({
      ...playlistData,
      episodes: playlistData.episodes.map((episode) => episode.toDto())
    })
    const { id } =
      (await PlaylistService.createAutoPlaylist(autoPlaylist)) || {}
    const playlist = await getPlaylist(id)
    expect(playlist?.isAutoPlaylist).toBe(1)
  })

  it('createAutoPlaylist: should return existing auto playlist if auto playlist already exists', async () => {
    const autoPlaylist1 = new Playlist({
      ...playlistData,
      id: 1,
      episodes: playlistData.episodes.map((episode) => episode.toDto())
    })

    await PlaylistService.createAutoPlaylist(autoPlaylist1)

    const autoPlaylist2 = new Playlist({
      ...playlistData,
      id: 2,
      episodes: playlistData.episodes.map((episode) => episode.toDto())
    })

    const playlist = await PlaylistService.createAutoPlaylist(autoPlaylist2)
    expect(playlist.id).toEqual(autoPlaylist1.id)
  })

  it('updateAutoPlaylist: should update an auto playlist', async () => {
    await PlaylistService.createAutoPlaylist(autoPlaylistMock)
    const playlist = await PlaylistService.updateAutoPlaylist(
      new Playlist({
        ...autoPlaylistMock,
        name: 'Updated Auto Playlist',
        description: 'Updated Description',
        episodes: episodesMock,
        cursor: 1,
        isAutoPlaylist: TRUE
      })
    )
    expect(playlist).toBeDefined()
  })

  it('updateAutoPlaylist: should return null if no auto playlist is found', async () => {
    const playlist = await PlaylistService.updateAutoPlaylist(autoPlaylistMock)
    expect(playlist).toBeNull()
  })

  it('deleteAutoPlaylist: should delete an auto playlist', async () => {
    await PlaylistService.createAutoPlaylist(autoPlaylistMock)
    const success = await PlaylistService.deleteAutoPlaylist()
    expect(success).toBe(true)
  })

  it('deleteAutoPlaylist: should return false if no auto playlist is found', async () => {
    const success = await PlaylistService.deleteAutoPlaylist()
    expect(success).toBe(false)
  })
})
