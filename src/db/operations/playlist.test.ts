import { Playlist } from '@/models/Playlist'
import { PlaylistService } from '@/services/PlaylistService'
import { playlistMock } from '@/mocks/playlists'

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

  it('should create a playlist', async () => {
    const playlist = await PlaylistService.createPlaylist(playlistData)
    expect(playlist).toBeDefined()
  })

  it('should get a playlist', async () => {
    const playlist = await PlaylistService.getPlaylist(1)
    expect(playlist).toBeDefined()
  })

  it('should update a playlist', async () => {
    const playlist = await PlaylistService.updatePlaylist(playlistData)
    expect(playlist).toBeDefined()
  })

  it('should delete a playlist', async () => {
    const successFulDelete = await PlaylistService.deletePlaylist(1)
    expect(successFulDelete).toBe(true)
  })

  it('should delete all playlists', async () => {
    const successFulDelete = await PlaylistService.deleteAllPlaylists()
    expect(successFulDelete).toBe(true)
  })

  it('should set a playlist as current', async () => {
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

  it('should unset a playlist as current', async () => {
    const id = await PlaylistService.unsetAsCurrentPlaylist()
    if (id) {
      const playlist = await PlaylistService.getPlaylist(id)
      expect(playlist?.isCurrentPlaylist).toBe(0)
    }
  })

  it('should get an auto playlist', async () => {
    const autoPlaylist = new Playlist({
      ...playlistData,
      episodes: playlistData.episodes.map((episode) => episode.toDto())
    })
    await PlaylistService.createAutoPlaylist(autoPlaylist)
    const playlistRaw = await PlaylistService.getAutoPlaylist()
    expect(playlistRaw).toBeDefined()
  })

  it('should create an auto playlist', async () => {
    const autoPlaylist = new Playlist({
      ...playlistData,
      episodes: playlistData.episodes.map((episode) => episode.toDto())
    })
    const playlist = await PlaylistService.createAutoPlaylist(autoPlaylist)
    expect(playlist).toBeDefined()
    expect(playlist?.isAutoPlaylist).toBe(1)
  })

  it('should update an auto playlist', async () => {
    const autoPlaylist = new Playlist({
      ...playlistData,
      episodes: playlistData.episodes.map((episode) => episode.toDto())
    })
    const playlist = await PlaylistService.updateAutoPlaylist(autoPlaylist)
    expect(playlist).toBeDefined()
  })

  it('should delete an auto playlist', async () => {
    const success = await PlaylistService.deleteAutoPlaylist()
    expect(success).toBe(true)
  })
})
