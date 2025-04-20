// test the PlaylistController

import { Playlist } from '@/models/Playlist'
import {
  PlaylistController,
  playlistControllerStore
} from './PlaylistController'
import { TRUE, FALSE } from '@/db/constants'

describe('PlaylistController', () => {
  beforeEach(() => {
    playlistControllerStore.getState().reset()
  })

  it('should initialize the controller', () => {
    const controller = new PlaylistController()
    expect(controller).toBeDefined()
    expect(controller.store).toBeDefined()
    expect(controller.getPlaylists()).toEqual([])
    expect(controller.getAutoPlaylist()).toBeNull()
    expect(controller.getSelectedPlaylist()).toBeNull()
  })

  it('should add a playlist', () => {
    const controller = new PlaylistController()
    const playlist = new Playlist({ id: 1, name: 'Test Playlist' })
    controller.addPlaylist(playlist)
    expect(controller.getPlaylists()).toEqual([playlist])
  })

  it('should add multiple playlists', () => {
    const controller = new PlaylistController()
    const playlists = [
      new Playlist({ id: 1, name: 'Test Playlist 1' }),
      new Playlist({ id: 2, name: 'Test Playlist 2' })
    ]
    controller.bulkAddPlaylist(playlists)
    expect(controller.getPlaylists()).toEqual(playlists)
  })

  it('should get all playlists', () => {
    const controller = new PlaylistController()
    const playlists = [
      new Playlist({ id: 1, name: 'Test Playlist 1' }),
      new Playlist({ id: 2, name: 'Test Playlist 2' })
    ]
    controller.bulkAddPlaylist(playlists)
    expect(controller.getPlaylists()).toEqual(playlists)
  })

  it('should get the auto playlist', () => {
    const controller = new PlaylistController()
    const playlist = new Playlist({
      id: 1,
      name: 'Test Playlist',
      isAutoPlaylist: TRUE
    })

    const playlist2 = new Playlist({
      id: 2,
      name: 'Test Playlist 2',
      isAutoPlaylist: FALSE
    })
    controller.bulkAddPlaylist([playlist, playlist2])
    expect(controller.getAutoPlaylist()).toEqual(playlist)
  })

  it('should get the current playlist', () => {
    const controller = new PlaylistController()
    const playlist = new Playlist({ id: 1, name: 'Test Playlist' })
    controller.addPlaylist(playlist)
    expect(controller.getSelectedPlaylist()).toEqual(playlist)
  })

  it('should get the next playlist', () => {
    const controller = new PlaylistController()
    const playlist = new Playlist({ id: 1, name: 'Test Playlist' })
    const playlist2 = new Playlist({ id: 2, name: 'Test Playlist 2' })
    controller.bulkAddPlaylist([playlist, playlist2])

    controller.nextPlaylist()
    expect(controller.getSelectedPlaylist()).toEqual(playlist2)
  })

  it('should get the previous playlist', () => {
    const controller = new PlaylistController()
    const playlist = new Playlist({ id: 1, name: 'Test Playlist' })
    const playlist2 = new Playlist({ id: 2, name: 'Test Playlist 2' })
    controller.bulkAddPlaylist([playlist, playlist2])

    controller.nextPlaylist()
    controller.prevPlaylist()
    expect(controller.getSelectedPlaylist()).toEqual(playlist)
  })

  it('should remove a playlist', () => {
    const controller = new PlaylistController()
    const playlist = new Playlist({ id: 1, name: 'Test Playlist' })
    controller.addPlaylist(playlist)
    controller.removePlaylist(playlist.id!)
    expect(controller.getPlaylists()).toEqual([])
  })

  it('should select a playlist', () => {
    const controller = new PlaylistController()
    const playlist = new Playlist({ id: 1, name: 'Test Playlist' })
    const playlist2 = new Playlist({ id: 2, name: 'Test Playlist 2' })
    controller.bulkAddPlaylist([playlist, playlist2])
    controller.selectPlaylist(playlist.id!)
    expect(controller.getSelectedPlaylist()).toEqual(playlist)
  })

  it('should select a playlist that is not the current playlist', () => {
    const controller = new PlaylistController()
    const playlist = new Playlist({ id: 1, name: 'Test Playlist' })
    const playlist2 = new Playlist({ id: 2, name: 'Test Playlist 2' })
    controller.bulkAddPlaylist([playlist, playlist2])
    controller.selectPlaylist(3)
    expect(controller.getSelectedPlaylist()).toEqual(playlist)
  })

  it('should select a playlist that does not exist', () => {
    const controller = new PlaylistController()
    controller.selectPlaylist(999)
    expect(controller.getSelectedPlaylist()).toBeNull()
  })
})
