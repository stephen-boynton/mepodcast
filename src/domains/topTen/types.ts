import { EpisodeDetails } from "../episodes/types";
import { SeriesDetail } from "../series/types";

export type TopTenSeries = {
  topChartsId: string;
  series: SeriesDetail[];
  podcastEpisodes: EpisodeDetails[];
};
