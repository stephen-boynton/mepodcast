import { Playlist, PlaylistDto } from '@/models/Playlist'
import { Progress } from '@/models/Progress'
import { Series } from '@/models/Series'
import Dexie, { type EntityTable } from 'dexie'

interface Id {
  id?: number
}

export type SeriesData = Series & { id?: number; seriesUuid: string }
export type ProgressData = Progress & { id?: number }

export class Database extends Dexie {
  series!: EntityTable<SeriesData, 'id'>
  progress!: EntityTable<ProgressData, 'id'>
  playlists!: EntityTable<PlaylistDto, 'id'>

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
		subtitle,
		websiteUrl`,
      progress: `
		++id,
		episodeUuid,
		progress,
		seriesUuid`,
      playlists: `
		++id,
		name,
		description,
		episodes,
		cursor,
		isAutoPlaylist,
		isCurrentPlaylist`
    })
    this.series.mapToClass(Series)
    this.progress.mapToClass(Progress)
    this.playlists.mapToClass(Playlist)
  }
}

export const db = new Database()
