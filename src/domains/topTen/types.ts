import { EpisodeDetails } from "../episodes/types";
import { SeriesDetail } from "../series/types";

export type TopTenSeries = {
  topChartsId: string;
  podcastSeries: SeriesDetail[];
  podcastEpisodes: EpisodeDetails[];
};
