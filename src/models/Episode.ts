import { Maybe } from "@/types/shared";
import type { Series } from "./Series";

export class Episode {
  audioUrl: Maybe<string> = null;
  datePublished: Maybe<number> = null;
  description: Maybe<string> = null;
  duration: Maybe<number> = null;
  episodeNumber: Maybe<number> = null;
  imageUrl: Maybe<string> = null;
  listens: Maybe<number> = null;
  name: Maybe<string> = null;
  podcastSeries: Maybe<Partial<Series>> = null;
  podcastUuid: Maybe<string> = null;
  seasonNumber: Maybe<number> = null;
  subtitle: Maybe<string> = null;
  uuid: string = "";
  websiteUrl: Maybe<string> = null;

  constructor(episode: Episode) {
    Object.assign(this, episode);
  }

  get authorName() {
    return this.podcastSeries?.authorName;
  }
}

export function createEpisode(episode: Episode) {
  return new Episode(episode);
}
