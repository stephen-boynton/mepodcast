import { Logger } from '@/lib/Logger'
import { db } from '..'
import { CurrentlyPlayingData } from '../Database'

export async function getCurrentlyPlaying() {
  return await db.currentlyPlaying.where({ active: true }).first()
}

export async function saveCurrentlyPlaying(
  currentlyPlaying: CurrentlyPlayingData
) {
  return await db.currentlyPlaying.put(currentlyPlaying)
}

export async function removeCurrentlyPlaying() {
  try {
    const count = await db.currentlyPlaying
      .where('active')
      .equals('true')
      .count()
    if (count === 0) {
      Logger.warn('No currently playing episode found.')
      return
    }

    return await db.currentlyPlaying
      .where('active')
      .equals('true')
      .modify({ active: false })
  } catch (error) {
    Logger.error(`Error removing currently playing episode: ${error}`)
  }
}
