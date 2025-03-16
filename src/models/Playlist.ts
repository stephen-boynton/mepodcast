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
  cursor: number = 0
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
      console.log({ id })
      newPlaylist.id = id
      return newPlaylist
    } else {
      const newPlaylist = new Playlist({ ...playlist, isAutoPlaylist: TRUE })
      const id = await createAutoPlaylist(newPlaylist)
      console.log({ id })
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

  addEpisodeToPlaylist(episode: Episode) {
    this.episodes.push(episode)
    this.save()
  }

  addAsCurrentlyPlaying(episode: Episode) {
    this.episodes.unshift(episode)
    this.cursor = 0
    this.save()
  }

  addAsPlayNext(episode: Episode): void {
    if (this.episodes.length) {
      const [playing, ...rest] = this.episodes
      this.episodes = [playing, episode, ...rest]
    } else {
      this.episodes = [episode]
    }
    this.save()
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

  async save() {
    await updatePlaylist(this)
  }
}

export const initializePlaylist = (playlist: Partial<Playlist>) => {
  return new Playlist(playlist)
}
