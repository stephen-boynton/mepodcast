import { TOP_PODCAST_EPISODES, TOP_PODCAST_SERIES } from '@/gql'
import { getClient } from '@/lib/gql/podcastApi'
import { createEpisode } from '@/models/Episode'
import { createSeries } from '@/models/Series'

export const useTopTen = async () => {
  const { error: seriesError, data: seriesData } = await getClient().query({
    query: TOP_PODCAST_SERIES
  })
  const { error: episodeError, data: episodeData } = await getClient().query({
    query: TOP_PODCAST_EPISODES
  })

  return {
    error: seriesError || episodeError,
    data: {
      series: seriesData?.getTopChartsByCountry?.series.map(createSeries),
      episodes:
        episodeData?.getTopChartsByCountry?.podcastEpisodes.map(createEpisode)
    }
  }
}
