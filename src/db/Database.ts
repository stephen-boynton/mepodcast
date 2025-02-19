import { Series } from "@/models/Series";
import Dexie, { type EntityTable } from "dexie";

export type SeriesData = Series & { id?: number; seriesUuid: string };

export class Database extends Dexie {
  series!: EntityTable<SeriesData, "id">;

  constructor() {
    super("PodcastDB");
    this.version(1).stores({
      series: `
		++id, 
		authorName,
		datePublished,
		description,
		episodes,
		imageUrl,
		listens,
		name,
		seriesUuid,
		totalEpisodesCount,
		uuid,
		websiteUrl
		`,
    });
    this.series.mapToClass(Series);
  }
}
