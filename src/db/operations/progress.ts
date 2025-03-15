import { Progress } from '@/models/Progress'
import { db } from '..'
import { ProgressData } from '../Database'

export async function getProgress(episodeUuid: string) {
  return await db.progress.where('episodeUuid').equals(episodeUuid).first()
}

export async function getSeriesProgress(seriesUuid: string) {
  return await db.progress.where('seriesUuid').equals(seriesUuid).toArray()
}

export async function createProgress(progress: Progress) {
  return await db.progress.add(progress)
}

export async function updateProgress(
  progress: Pick<ProgressData, 'id' | 'episodeProgress'>
) {
  return await db.progress.update(progress.id, progress)
}

export async function saveProgress(progress: Progress) {
  const savedProgress = await getProgress(progress?.episodeUuid)
  if (savedProgress) {
    return await updateProgress({
      ...savedProgress,
      ...progress
    })
  }
  return await createProgress(progress)
}

export async function deleteProgress(id: number) {
  return await db.progress.delete(id)
}
