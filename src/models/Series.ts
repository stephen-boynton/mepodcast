import { Maybe } from "@/types/shared";
import type { Episode } from "./Episode";

export class Series {
  authorName: Maybe<string> = null;
  datePublished: Maybe<number> = null;
  description: Maybe<string> = null;
  episodes?: Maybe<Partial<Episode[]>> = null;
  imageUrl: Maybe<string> = null;
  listens: Maybe<number> = null;
  name: Maybe<string> = null;
  seriesUuid: Maybe<string> = "";
  totalEpisodesCount: Maybe<number> = null;
  uuid: string = "";
  websiteUrl: Maybe<string> = null;

  constructor(series: Series) {
    Object.assign(this, {
      ...series,
      seriesUuid: series?.uuid,
    });
  }
}

export function createSeries(series: Series) {
  return new Series(series);
}
