import { getSeriesProgress } from '@/db/operations'
import { GET_PODCASTSERIES, LOAD_MORE_FROM_SERIES_QUERY } from '@/gql'
import { Episode } from '@/models/Episode'
import { useLazyQuery, useQuery } from '@apollo/client'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'

export const useSeriesDetails = ({ uuid }: { uuid: string }) => {
  const [page, setPage] = useState(2)
  const [episodes, setEpisodes] = useState<Episode[]>([])

  const { data, loading, error } = useQuery(GET_PODCASTSERIES, {
    variables: { uuid },
    onCompleted: (fetchedData) => {
      if (fetchedData?.getPodcastSeries?.episodes) {
        setEpisodes(fetchedData.getPodcastSeries.episodes)
      }
    }
  })

  const [loadMoreEpisodes, { loading: loadMoreLoading, error: loadMoreError }] =
    useLazyQuery(LOAD_MORE_FROM_SERIES_QUERY, {
      onCompleted: (fetchedData) => {
        if (fetchedData?.getPodcastSeries?.episodes) {
          setEpisodes((prevEpisodes) => [
            ...prevEpisodes,
            ...fetchedData.getPodcastSeries.episodes
          ])
        }
      }
    })

  const seriesProgress = useLiveQuery(() => getSeriesProgress(uuid), [uuid])

  const loadMore = () => {
    console.log('loading more')
    loadMoreEpisodes({
      variables: { uuid, page, limitPerPage: 10 }
    })
    setPage((prevPage) => prevPage + 1)
  }

  const dataWithProgress = data?.getPodcastSeries
    ? { ...data.getPodcastSeries, episodes, progress: seriesProgress || null }
    : null

  return {
    data: dataWithProgress,
    loading,
    error,
    loadMore,
    loadMoreLoading,
    loadMoreError
  }
}
