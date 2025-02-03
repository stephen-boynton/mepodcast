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

export type EpisodeDetails = SeriesEpisodes & {
  imageUrl: string;
  subtitle: string;
  audioUrl: string;
  websiteUrl: string;
  podcastSeries: {
    uuid: string;
    name: string;
    authorName: string;
    totalEpisodesCount: number;
    imageUrl: string;
    websiteUrl: Maybe<string>;
  };
};
