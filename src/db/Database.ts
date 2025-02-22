import { Progress } from "@/models/Progress"
import { Series } from "@/models/Series"
import Dexie, { type EntityTable } from "dexie"

export type SeriesData = Series & { id?: number; seriesUuid: string }
export type ProgressData = Progress & { id?: number }

export class Database extends Dexie {
  series!: EntityTable<SeriesData, "id">
  progress!: EntityTable<ProgressData, "id">

  constructor() {
    super("PodcastDB")
    this.version(2).stores({
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
      progress: `
		++id, 
		episodeUuid, 
		seriesUuid,
		episodeLength, 
		episodeProgress,
		completed
	  `,
    })
    this.series.mapToClass(Series)
    this.progress.mapToClass(Progress)
  }
}
