import { db } from '@/db'
import { FALSE, TRUE } from '@/db/constants'
import { Logger } from '@/lib/Logger'
import { Playlist } from '@/models/Playlist'

export class PlaylistService {
  static async getPlaylists() {
    return await db.playlists.toArray()
  }

  static async getPlaylist(id?: number) {
    if (!id) {
      return (
        (await db.playlists.where('isCurrentPlaylist').equals(TRUE).first()) ||
        null
      )
    }
    return (await db.playlists.get(id)) || null
  }

  static async createPlaylist(playlist: Playlist) {
    const id = await db.playlists.add(playlist.toDto())
    playlist.id = id
    return playlist
  }

  static async updatePlaylist(playlist: Playlist) {
    if (!playlist.id) {
      Logger.error('Playlist has no id')
      return null
    }
    const dto = playlist.toDto()
    await db.playlists.update(playlist.id, {
      name: dto.name,
      description: dto.description,
      episodes: dto.episodes,
      cursor: dto.cursor,
      isAutoPlaylist: dto.isAutoPlaylist,
      isCurrentPlaylist: dto.isCurrentPlaylist
    })
    return playlist
  }

  static async deletePlaylist(id: number) {
    return await db.playlists.delete(id)
  }

  static async deleteAllPlaylists() {
    return await db.playlists.clear()
  }

  static async setAsCurrentPlaylist(id: number) {
    await db.playlists
      .where('isCurrentPlaylist')
      .equals(TRUE)
      .modify({ isCurrentPlaylist: FALSE })
    await db.playlists.update(id, { isCurrentPlaylist: TRUE })
    return id
  }

  static async unsetAsCurrentPlaylist() {
    const current = await db.playlists
      .where('isCurrentPlaylist')
      .equals(TRUE)
      .first()
    if (current) {
      await db.playlists.update(current.id!, { isCurrentPlaylist: FALSE })
      return current.id
    }
    return null
  }

  static async getAutoPlaylist() {
    return await db.playlists.where('isAutoPlaylist').equals(TRUE).first()
  }

  static async createAutoPlaylist(playlist: Playlist) {
    const existingAutoPlaylist = await this.getAutoPlaylist()
    if (existingAutoPlaylist) {
      await this.deletePlaylist(existingAutoPlaylist.id!)
    }
    const id = await db.playlists.add({
      ...playlist.toDto(),
      isAutoPlaylist: TRUE
    })
    playlist.id = id
    return playlist
  }

  static async updateAutoPlaylist(playlist: Playlist) {
    const existingAutoPlaylist = await this.getAutoPlaylist()
    if (!existingAutoPlaylist) {
      return null
    }
    const dto = playlist.toDto()
    await db.playlists.update(existingAutoPlaylist.id!, {
      name: dto.name,
      description: dto.description,
      episodes: dto.episodes,
      cursor: dto.cursor,
      isAutoPlaylist: TRUE,
      isCurrentPlaylist: dto.isCurrentPlaylist
    })
    playlist.id = existingAutoPlaylist.id
    return playlist
  }

  static async deleteAutoPlaylist() {
    const autoPlaylist = await this.getAutoPlaylist()
    if (autoPlaylist) {
      return await this.deletePlaylist(autoPlaylist.id!)
    }
    return true
  }
}
