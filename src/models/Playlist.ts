import {
  createAutoPlaylist,
  createPlaylist,
  deleteAutoPlaylist,
  getAutoPlaylist,
  setAsCurrentPlaylist,
  unsetAsCurrentPlaylist,
  //   updateAutoPlaylist,
  updatePlaylist
} from '@/db/operations/playlist'
import { merge } from 'es-toolkit'
import { PlaylistData } from '@/db/Database'
import { Logger } from '@/lib/Logger'
import { Episode } from './Episode'

type Cboolean = 1 | 0

const TRUE: Cboolean = 1
const FALSE: Cboolean = 0

export class Playlist {
  #cursor = 0
  description?: string
  episodes: Episode[] = []
  id?: number
  isAutoPlaylist: Cboolean = FALSE
  isCurrentPlaylist: Cboolean = FALSE
  name: string = 'My-Playlist'

  constructor(playlist: Partial<Playlist>) {
    Object.assign(this, playlist)
  }

  static async createPlaylist({
    name,
    description,
    episodes
  }: {
    name: string
    description?: string
    episodes: Episode[] | []
  }) {
    const newPlaylist = new Playlist({ name, description, episodes })
    const id = await createPlaylist(newPlaylist)
    newPlaylist.id = id
    return newPlaylist
  }

  static async createAutoPlaylist(playlist: Partial<Playlist>) {
    const existingAutoPlaylist = await getAutoPlaylist()

    if (existingAutoPlaylist) {
      playlist = merge(playlist, { isAutoPlaylist: TRUE })
      await deleteAutoPlaylist()
      const newPlaylist = new Playlist({ ...playlist, isAutoPlaylist: TRUE })
      const id = await createAutoPlaylist(newPlaylist)
      newPlaylist.id = id
      return newPlaylist
    } else {
      const newPlaylist = new Playlist({ ...playlist, isAutoPlaylist: TRUE })
      const id = await createAutoPlaylist(newPlaylist)
      newPlaylist.id = id
      return newPlaylist
    }
  }

  static async transferCurrentPlayist(newPlaylist: PlaylistData) {
    if (!newPlaylist.id) {
      Logger.error('Playlist has no id')
      return
    }

    await unsetAsCurrentPlaylist()
    await newPlaylist.save()
    await setAsCurrentPlaylist(newPlaylist.id)
    return
  }

  async makeCurrentPlaylist() {
    await unsetAsCurrentPlaylist()
    await setAsCurrentPlaylist(this.id)
    await this.save()
  }

  addEpisodeToPlaylist(episode: Episode) {
    if (this.alreadyHasEpisode(episode.uuid)) return
    this.episodes.push(episode)
    this.save()
  }

  get cursor(): number {
    return this.#cursor || 0
  }

  set cursor(cursor: number) {
    if (cursor < 0) {
      cursor = 0
    }
    this.#cursor = cursor
  }

  async addAsCurrentlyPlaying(episode: Episode) {
    if (!episode) {
      Logger.error('Playlist: No episode provided')
      return
    }
    const has = this.alreadyHasEpisode(episode.uuid)

    if (!has) {
      this.episodes.unshift(episode)
    }
    console.log('am I here?')
    this.cursor = this.episodes.findIndex((e) => e.uuid === episode.uuid) || 0
    Logger.debug(`Playlist: Adding ${episode} as currently playing`)
    this.save()
  }

  addAsPlayNext(episode: Episode): void {
    const has = this.alreadyHasEpisode(episode.uuid)
    if (has) {
      const existing = this.episodes.find((e) => e.uuid === episode.uuid)
      if (!existing) {
        Logger.error('Playlist: Episode does not exist')
        return
      }
      Logger.debug('Playlist: Adding episode as play next')
      const [playing, ...rest] = this.episodes
      this.episodes = [playing, existing, ...rest]
      return
    }
    if (this.episodes.length) {
      Logger.debug('Playlist: Adding episode as play next')
      const [playing, ...rest] = this.episodes
      this.episodes = [playing, episode, ...rest]
    } else {
      Logger.debug('Playlist: Adding episode as only episode')
      this.episodes = [episode]
    }
    this.save()
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
      if (this.cursor < 0) {
        this.cursor = 0
      }
      return this.episodes[this.cursor]
    }
  }

  rewriteList(episodes: Episode[]) {
    const currentIds = episodes.map((episode) => episode.uuid)
    const existingIds = this.episodes.map((episode) => episode.uuid)
    const hasAllSameIds = existingIds.every((id) => currentIds.includes(id))
    Logger.debug('Attempting to rewrite playlist', {
      currentIds,
      existingIds,
      hasAllSameIds
    })
    if (hasAllSameIds) {
      this.episodes = episodes
    } else {
      Logger.error(`Playlist rewrite failed: ${currentIds} !== ${existingIds}`)
    }
  }

  async save() {
    await updatePlaylist(this)
  }
}

export const initializePlaylist = (playlist: Partial<Playlist>) => {
  return new Playlist(playlist)
}
