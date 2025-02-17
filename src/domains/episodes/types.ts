import { Maybe } from "graphql/jsutils/Maybe";

export type SeriesEpisodes = {
  datePublished: number;
  description: string;
  duration: number;
  episodeNumber: number;
  name: string;
  seasonNumber: number;
  uuid: string;
};

export type EpisodeDetails = Partial<SeriesEpisodes> & {
  audioUrl: string;
  imageUrl: string;
  podcastSeries?: {
    uuid: string;
    name: string;
    authorName: string;
    totalEpisodesCount: number;
    imageUrl: string;
    websiteUrl: Maybe<string>;
  };
  subtitle: string;
  websiteUrl: string;
};
