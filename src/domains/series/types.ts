import { Maybe } from "graphql/jsutils/Maybe";
import { SeriesEpisodes } from "../episodes/types";

export type SeriesDetail = {
  uuid: string;
  name: string;
  datePublished: number;
  imageUrl: string;
  episodes: SeriesEpisodes[];
  authorName: string;
  description: string;
  totalEpisodesCount: number;
  websiteUrl: Maybe<string>;
};
