import { Playlist } from '@/models/Playlist'
import { db } from '..'
import {
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  deleteAllPlaylists,
  setAsCurrentPlaylist,
  unsetAsCurrentPlaylist,
  getAutoPlaylist,
  createAutoPlaylist,
  updateAutoPlaylist,
  deleteAutoPlaylist
} from './playlist'

import { playlistMock } from '@/mocks/playlists'

describe('Playlist Operations', () => {
  const playlistName = 'Test Playlist'

  const playlistData: Playlist = {
    ...playlistMock,
    cursor: 0,
    makeCurrentPlaylist: jest.fn(),
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
    save: jest.fn()
  }

  it.only('should create a playlist', async () => {
    console.log('here')
    const playlist = await createPlaylist(playlistData)
    console.log({ playlist })
    expect(playlist).toBeDefined()
  })

  it('should get a playlist', async () => {
    const playlist = await getPlaylist(playlistId)
    expect(playlist).toBeDefined()
  })

  it('should update a playlist', async () => {
    const playlist = await updatePlaylist(playlistId, playlistName)
    expect(playlist).toBeDefined()
  })

  it('should delete a playlist', async () => {
    const playlist = await deletePlaylist(playlistId)
    expect(playlist).toBeDefined()
  })

  it('should delete all playlists', async () => {
    const playlists = await deleteAllPlaylists()
    expect(playlists).toBeDefined()
  })

  it('should set a playlist as current', async () => {
    const playlist = await setAsCurrentPlaylist(playlistId)
    expect(playlist).toBeDefined()
  })

  it('should unset a playlist as current', async () => {
    const playlist = await unsetAsCurrentPlaylist()
    expect(playlist).toBeDefined()
  })

  it('should get an auto playlist', async () => {
    const playlist = await getAutoPlaylist()
    expect(playlist).toBeDefined()
  })

  it('should create an auto playlist', async () => {
    const playlist = await createAutoPlaylist(playlistName)
    expect(playlist).toBeDefined()
  })

  it('should update an auto playlist', async () => {
    const playlist = await updateAutoPlaylist(playlistId, playlistName)
    expect(playlist).toBeDefined()
  })

  it('should delete an auto playlist', async () => {
    const playlist = await deleteAutoPlaylist()
    expect(playlist).toBeDefined()
  })
})
