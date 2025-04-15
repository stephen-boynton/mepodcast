import { Logger } from '@/lib/Logger'
import { db } from '..'
import { Series } from '@/models/Series'
import { SeriesData } from '../Database'

export async function getAllSeries() {
  return await db.series.toArray()
}

export async function getSeries(uuid: string) {
  return await db.series.where('seriesUuid').equals(uuid).first()
}

export async function deleteSeries(uuid: string) {
  await db.series.where('seriesUuid').equals(uuid).delete()
  return true
}

export async function deleteAllSeries() {
  await db.series.clear()
  return true
}

export async function upsertSeries(series: Series) {
  if (!series.seriesUuid) {
    Logger.warn(`Missing series uuid: ${series.name}`)
    return false
  }
  await db.series.put(series as SeriesData)
  return true
}
