import { TOP_PODCAST_EPISODES, TOP_PODCAST_SERIES } from "@/gql";
import { createEpisode } from "@/models/Episode";
import { createSeries } from "@/models/Series";
import { useQuery } from "@apollo/client";

export const useTopTen = () => {
  const {
    error: seriesError,
    loading: seriesLoading,
    data: seriesData,
  } = useQuery(TOP_PODCAST_SERIES);
  const {
    error: episodeError,
    loading: episodeLoading,
    data: episodeData,
  } = useQuery(TOP_PODCAST_EPISODES);

  return {
    loading: seriesLoading || episodeLoading,
    error: seriesError || episodeError,
    data: {
      series: seriesData?.getTopChartsByCountry?.series.map(createSeries),
      episodes:
        episodeData?.getTopChartsByCountry?.podcastEpisodes.map(createEpisode),
    },
  };
};
