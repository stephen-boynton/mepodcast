'use client'
import { deleteSeries, getSeries, upsertSeries } from '@/db/operations/series'
import { Series } from '@/models/Series'
import { useLiveQuery } from 'dexie-react-hooks'

export const useAddToFavoriteSeries = ({ series }: { series: Series }) => {
  const exists = useLiveQuery(() => {
    if (!series?.uuid) {
      return null
    }

    return getSeries(series?.uuid)
  }, [series?.uuid])

  const addSeries = async () => {
    if (exists) {
      return true
    }

    return await upsertSeries(series)
  }

  const removeSeries = async () => {
    console.log('hererereerererererererererr')
    return await deleteSeries(series?.uuid)
  }

  return {
    isSubscribed: !!exists,
    addSeries,
    removeSeries
  }
}
