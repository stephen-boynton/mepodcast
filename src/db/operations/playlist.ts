import { Playlist } from '@/models/Playlist'
import { db } from '..'
import { Logger } from '@/lib/Logger'

const TRUE = 1
const FALSE = 0

export const getPlaylists = async () => {
  return await db.playlists.toArray()
}

export const getPlaylist = async (id?: number) => {
  if (!id) {
    return (
      (await db.playlists.where('isCurrentPlaylist').equals(TRUE).first()) ||
      null
    )
  }
  return (await db.playlists.get(id)) || null
}

export const createPlaylist = async (playlist: Playlist) => {
  return await db.playlists.add(playlist.toDto())
}

export const updatePlaylist = async (playlist: Playlist) => {
  if (!playlist.id) {
    Logger.error('Playlist has no id')
  }

  return await db.playlists.put(playlist.toDto())
}

export const deletePlaylist = async (id: number) => {
  try {
    await db.playlists.delete(id)
    return true
  } catch (error: unknown) {
    Logger.error(`Error deleting playlist ${id} - ${(error as Error).message}`)
    return false
  }
}

export const deleteAllPlaylists = async () => {
  try {
    await db.playlists.clear()
    return true
  } catch (error: unknown) {
    Logger.error(`Error deleting all playlists - ${(error as Error).message}`)
    return false
  }
}

export const setAsCurrentPlaylist = async (id: number) => {
  return await db.playlists.where('id').equals(id).modify({
    isCurrentPlaylist: TRUE
  })
}

export const unsetAsCurrentPlaylist = async () => {
  return await db.playlists.where('isCurrentPlaylist').equals(TRUE).modify({
    isCurrentPlaylist: FALSE
  })
}

// Auto playlist ===============================================================

export const getAutoPlaylist = async () => {
  return await db.playlists.where('isAutoPlaylist').equals(TRUE).first()
}

export const createAutoPlaylist = async (playlist: Playlist) => {
  return await db.playlists.add({
    ...playlist.toDto(),
    isAutoPlaylist: TRUE
  })
}

export const updateAutoPlaylist = async (playlist: Playlist) => {
  const playlistToUpdate = await db.playlists
    .where('isAutoPlaylist')
    .equals(TRUE)
    .first()

  if (!playlistToUpdate) {
    Logger.error('Auto playlist not found')
  }

  return await db.playlists.put(playlist.toDto())
}

export const deleteAutoPlaylist = async () => {
  return await db.playlists.where('isAutoPlaylist').equals(TRUE).delete()
}
