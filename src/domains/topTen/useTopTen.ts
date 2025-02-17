import { TOP_PODCAST_EPISODES, TOP_PODCAST_SERIES } from "@/gql";
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
      series: seriesData?.getTopChartsByCountry?.podcastSeries,
      episodes: episodeData?.getTopChartsByCountry?.podcastEpisodes,
    },
  };
};
