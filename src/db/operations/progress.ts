import { Progress, ProgressDto } from '@/models/Progress'
import { db } from '..'
import { ProgressData } from '../Database'
import { Logger } from '@/lib/Logger'

export async function getProgress(episodeUuid: string) {
  if (!episodeUuid) {
    return null
  }
  return (
    (await db.progress.where('episodeUuid').equals(episodeUuid).first()) || null
  )
}

export async function getAllProgress() {
  return await db.progress.toArray()
}

export async function getSeriesProgress(seriesUuid: string) {
  return await db.progress.where('seriesUuid').equals(seriesUuid).toArray()
}

export async function createProgress(progress: Progress) {
  return await db.progress.add(progress)
}

export async function updateProgress(progress: ProgressDto) {
  return await db.progress.put(progress)
}

export async function saveProgress(progress: Partial<ProgressData>) {
  if (!progress?.episodeUuid) {
    Logger.error('saveProgress: No episodeUuid')
    return null
  }

  const savedProgress = await getProgress(progress.episodeUuid)
  if (savedProgress) {
    return await updateProgress({
      ...savedProgress,
      ...progress
    })
  }

  return await createProgress(progress as Progress)
}

export async function deleteProgress(id: number) {
  return await db.progress.delete(id)
}

export async function deleteAllProgress() {
  return await db.progress.clear()
}
