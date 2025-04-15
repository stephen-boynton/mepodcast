// make mock playlist using episodesMock

import { Cboolean, FALSE, TRUE } from '@/db/constants'
import { episodesMock } from './episodes'
import { Playlist } from '@/models/Playlist'

export const playlistMockCreator: (
  name: string,
  description: string,
  id: number,
  isAuto?: Cboolean
) => Playlist = (
  name: string,
  description: string,
  id: number,
  isAuto: Cboolean = FALSE
) => {
  return {
    id,
    addAsCurrentlyPlaying: () => Promise.resolve(),
    addAsPlayNext: () => Promise.resolve(),
    addEpisodeToPlaylist: () => Promise.resolve(),
    alreadyHasEpisode: () => true,
    changeEpisodeOrder: () => Promise.resolve(),
    clearPlaylist: () => Promise.resolve(),
    cursor: 0,
    description,
    episodes: episodesMock,
    episodesCount: episodesMock.length,
    getCurrent: () => episodesMock[0],
    getEpisodes: () => Promise.resolve(episodesMock),
    getEpisodesCount: () => Promise.resolve(episodesMock.length),
    getNext: () => episodesMock[1],
    getPrevious: () => episodesMock[0],
    isAutoPlaylist: isAuto,
    isCurrentPlaylist: 0,
    makeCurrentPlaylist: () => Promise.resolve(),
    name,
    removeEpisodeFromPlaylist: () => Promise.resolve(),
    rewriteList: () => Promise.resolve(),
    save: () => Promise.resolve(),
    toDto: () => ({
      id,
      name,
      description,
      episodes: episodesMock.map((episode) => episode.toDto()),
      cursor: 0,
      isAutoPlaylist: 0,
      isCurrentPlaylist: 0
    })
  }
}

export const playlistMock: Playlist = playlistMockCreator(
  'Test Playlist',
  'Test Description',
  1
)

export const playlistMock2: Playlist = playlistMockCreator(
  'Test Playlist 2',
  'Test Description 2',
  2
)

export const playlistMock3: Playlist = playlistMockCreator(
  'Test Playlist 3',
  'Test Description 3',
  3
)

export const autoPlaylistMock: Playlist = playlistMockCreator(
  'Test Auto Playlist',
  'Test Description 4',
  4,
  TRUE
)

export const playlistsMock: Playlist[] = [
  playlistMock,
  playlistMock2,
  playlistMock3
]
