import { Cboolean, FALSE } from '@/db/constants'
import { Episode, EpisodeDto } from './Episode'

export interface PlaylistDto {
  id?: number
  name: string
  description?: string
  episodes: EpisodeDto[]
  cursor: number
  isAutoPlaylist: Cboolean
  isCurrentPlaylist: Cboolean
}

export class Playlist {
  _cursor?: number
  description?: string
  episodes: Episode[] = []
  id?: number
  isAutoPlaylist: Cboolean = FALSE
  isCurrentPlaylist: Cboolean = FALSE
  name: string = 'My-Playlist'

  constructor(playlist: Partial<Playlist | PlaylistDto>) {
    Object.assign(this, playlist)
    this.episodes =
      playlist.episodes?.map((episode) => new Episode(episode as EpisodeDto)) ||
      []
  }

  get cursor(): number {
    return this._cursor || 0
  }

  set cursor(cursor: number) {
    if (cursor < 0) {
      cursor = 0
    }
    this._cursor = cursor
  }

  addEpisodeToPlaylist(episode: Episode) {
    if (this.alreadyHasEpisode(episode.uuid)) return
    this.episodes.push(episode)
  }

  addAsCurrentlyPlaying(episode: Episode) {
    const has = this.alreadyHasEpisode(episode.uuid)

    if (!has) {
      this.episodes.unshift(episode)
    }

    this.cursor = this.episodes.findIndex((e) => e.uuid === episode.uuid) || 0
    this.rewriteList(this.episodes)
  }

  addAsPlayNext(episode: Episode): void {
    const has = this.alreadyHasEpisode(episode.uuid)

    if (has) {
      const existing = this.episodes.find((e) => e.uuid === episode.uuid)
      console.log({ existing })
      if (!existing) return
      const [playing, ...rest] = this.episodes
      this.episodes = [playing, existing, ...rest]
      return
    }

    if (this.episodes.length) {
      const [playing, ...rest] = this.episodes
      this.episodes = [playing, episode, ...rest]
    } else {
      this.episodes = [episode]
    }
  }

  alreadyHasEpisode(uuid: string) {
    return this.episodes.map((episode) => episode.uuid).includes(uuid)
  }

  removeEpisodeFromPlaylist(uuid: string) {
    this.episodes = this.episodes.filter((episode) => episode.uuid !== uuid)
  }

  clearPlaylist() {
    this.episodes = []
  }

  changeEpisodeOrder(uuid: string, index: number) {
    const episodeToMove = this.episodes.find((episode) => episode.uuid === uuid)
    const currentIndex = this.episodes.findIndex(
      (episode) => episode.uuid === uuid
    )

    if (episodeToMove) {
      this.episodes.splice(currentIndex, 1)
      this.episodes.splice(index, 0, episodeToMove)
    }
  }

  getCurrent() {
    if (this.episodes.length) {
      return this.episodes[this.cursor]
    }
  }

  getNext() {
    if (this.episodes.length) {
      this.cursor += 1
      return this.episodes[this.cursor]
    }
  }

  getPrevious() {
    if (this.episodes.length) {
      this.cursor -= 1
      return this.episodes[this.cursor]
    }
  }

  rewriteList(episodes: Episode[]) {
    const currentlyEpisode = this.getCurrent()
    const currentIds = episodes.map((episode) => episode.uuid)
    const existingIds = this.episodes.map((episode) => episode.uuid)
    const hasAllSameIds = existingIds.every((id) => currentIds.includes(id))
    if (hasAllSameIds) {
      this.episodes = episodes
      if (currentlyEpisode) {
        this.cursor =
          episodes.findIndex(
            (episode) => episode.uuid === currentlyEpisode.uuid
          ) || 0
      }
    }
  }

  toDto(): PlaylistDto {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      episodes: this.episodes.map((episode) => episode.toDto()),
      cursor: this.cursor,
      isAutoPlaylist: this.isAutoPlaylist,
      isCurrentPlaylist: this.isCurrentPlaylist
    }
  }
}

export const initializePlaylist = (playlist: Partial<PlaylistDto>) => {
  return new Playlist(playlist)
}
