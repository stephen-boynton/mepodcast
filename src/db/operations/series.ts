import { Logger } from '@/lib/Logger'
import { db } from '..'
import { Series } from '@/models/Series'
import { SeriesData } from '../Database'

export async function getAllSeries() {
  return await db.series.toArray()
}

export async function getSeries(uuid: string) {
  return await db.series.get({ uuid })
}

export async function deleteSeries(uuid: string) {
  return await db.series.where('uuid').equals(uuid).delete()
}

export async function upsertSeries(series: Series) {
  if (!series.uuid) {
    Logger.warn(`Missing series uuid: ${series.name}`)
    return null
  }

  await db.series.put(series as SeriesData)
  return true
}
