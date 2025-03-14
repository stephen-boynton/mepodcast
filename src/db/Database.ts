import { CurrentlyPlaying } from '@/models/CurrentlyPlaying'
import { Progress } from '@/models/Progress'
import { Series } from '@/models/Series'
import Dexie, { type EntityTable } from 'dexie'

export type SeriesData = Series & { id?: number; seriesUuid: string }
export type ProgressData = Progress & { id?: number }
export type CurrentlyPlayingData = CurrentlyPlaying & {
  id?: number
  active: boolean
}

export class Database extends Dexie {
  series!: EntityTable<SeriesData, 'id'>
  progress!: EntityTable<ProgressData, 'id'>
  currentlyPlaying!: EntityTable<CurrentlyPlayingData, 'id'>

  constructor() {
    super('PodcastDB')
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
      currentlyPlaying: `
		++id,
		active, 
		audioUrl,
		authorName,
		completed,
		datePublished,
		description,
		duration,
		episodeNumber,
		imageUrl,
		listens,
		name,
		series,
		seriesUuid,
		seasonNumber,
		subtitle,
		uuid,
		websiteUrl
	  `
    })
    this.series.mapToClass(Series)
    this.progress.mapToClass(Progress)
    this.currentlyPlaying.mapToClass(CurrentlyPlaying)
  }
}
