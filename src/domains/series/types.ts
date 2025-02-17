import { Maybe } from "graphql/jsutils/Maybe";
import { EpisodeDetails } from "../episodes/types";

export type SeriesDetail = {
  authorName: string;
  datePublished: number;
  description: string;
  episodes?: EpisodeDetails[];
  imageUrl: string;
  name: string;
  totalEpisodesCount: number;
  uuid: string;
  websiteUrl: Maybe<string>;
};
