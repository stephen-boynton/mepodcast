// playlist operations tests

import { Playlist } from '@/models/Playlist'
import {
  createPlaylist,
  deleteAutoPlaylist,
  deletePlaylist,
  deleteAllPlaylists,
  getAutoPlaylist,
  getPlaylist,
  updateAutoPlaylist,
  updatePlaylist,
  createAutoPlaylist,
  getPlaylists,
  setAsCurrentPlaylist,
  unsetAsCurrentPlaylist
} from './playlist'
import {
  autoPlaylistMock,
  playlistMock,
  playlistMock2
} from '@/mocks/playlists'
import { IDBFactory } from 'fake-indexeddb'

describe('Playlist Operations', () => {
  beforeEach(async () => {
    await deleteAllPlaylists()
    indexedDB = new IDBFactory()
  })

  it('createPlaylist', async () => {
    await createPlaylist(playlistMock)
    const playlist = await getPlaylist(playlistMock.id)
    expect(playlist).toBeDefined()
  })

  it('deletePlaylist', async () => {
    await createPlaylist(playlistMock)
    await deletePlaylist(playlistMock.id!)
    const playlist = await getPlaylist(playlistMock.id)
    expect(playlist).toBeNull()
  })

  it('getPlaylist', async () => {
    const playlist = await getPlaylist(playlistMock.id)
    expect(playlist).toBeDefined()
  })

  it('getPlaylist should return null if no playlist is found', async () => {
    const playlist = await getPlaylist(999)
    expect(playlist).toBeNull()
  })

  it('getPlaylist should return null if no id is provided', async () => {
    const playlist = await getPlaylist()
    expect(playlist).toBeNull()
  })

  it('getPlaylists', async () => {
    await createPlaylist(playlistMock)
    await createPlaylist(autoPlaylistMock)
    await createPlaylist(playlistMock2)
    const playlists = await getPlaylists()
    expect(playlists.length).toBe(3)
  })

  it('getAutoPlaylist', async () => {
    await createAutoPlaylist(autoPlaylistMock)
    const playlist = await getAutoPlaylist()
    expect(playlist).toBeDefined()
  })

  it('updatePlaylist', async () => {
    const newPlaylist = new Playlist({
      ...playlistMock.toDto(),
      name: 'Noop Playlist'
    })
    const playlistUpdate = new Playlist({
      ...newPlaylist.toDto(),
      name: 'Updated Playlist'
    })

    await createPlaylist(newPlaylist)
    await updatePlaylist(playlistUpdate)

    const updatedPlaylist = await getPlaylist(newPlaylist.id)
    expect(updatedPlaylist?.name).toBe('Updated Playlist')
  })

  it('updatePlaylist should return null if no id is provided', async () => {
    const newPlaylist = new Playlist({
      ...playlistMock.toDto(),
      name: 'Noop Playlist',
      id: undefined
    })

    const playlist = await updatePlaylist(newPlaylist)

    expect(playlist).toBeNull()
  })

  it('updateAutoPlaylist', async () => {
    const playlist = await updateAutoPlaylist(autoPlaylistMock)
    expect(playlist).toBeDefined()
  })

  it('deleteAutoPlaylist', async () => {
    const playlist = await deleteAutoPlaylist()
    expect(playlist).toBeDefined()
  })

  it('setAsCurrentPlaylist', async () => {
    const newPlaylist = new Playlist({
      ...playlistMock.toDto(),
      isCurrentPlaylist: 0
    })

    await createPlaylist(newPlaylist)

    await setAsCurrentPlaylist(newPlaylist.id!)

    const playlist = await getPlaylist(newPlaylist.id!)
    expect(playlist?.isCurrentPlaylist).toBe(1)
  })

  it('unsetAsCurrentPlaylist', async () => {
    const newPlaylist = new Playlist({
      ...playlistMock.toDto(),
      isCurrentPlaylist: 1
    })

    await createPlaylist(newPlaylist)
    await unsetAsCurrentPlaylist()
    const playlist = await getPlaylist(newPlaylist.id!)
    expect(playlist?.isCurrentPlaylist).toBe(0)
  })
})
