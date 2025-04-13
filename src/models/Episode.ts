import { Maybe } from '@/types/shared'
import type { Series } from './Series'

export interface EpisodeDto {
  audioUrl: Maybe<string>
  authorName: Maybe<string>
  completed: boolean
  datePublished: Maybe<number>
  description: Maybe<string>
  duration: Maybe<number>
  episodeNumber: Maybe<number>
  imageUrl: Maybe<string>
  listens: Maybe<number>
  name: Maybe<string>
  series?: Maybe<Partial<Series>>
  seriesName: Maybe<string>
  seriesUuid: Maybe<string>
  seasonNumber: Maybe<number>
  subtitle: Maybe<string>
  uuid: string
  websiteUrl: Maybe<string>
}

export class Episode {
  audioUrl: Maybe<string> = null
  authorName: Maybe<string> = null
  completed: boolean = false
  datePublished: Maybe<number> = null
  description: Maybe<string> = null
  duration: Maybe<number> = null
  episodeNumber: Maybe<number> = null
  imageUrl: Maybe<string> = null
  listens: Maybe<number> = null
  name: Maybe<string> = null
  series?: Maybe<Partial<Series>> = null
  seriesName: Maybe<string> = null
  seriesUuid: Maybe<string> = null
  seasonNumber: Maybe<number> = null
  subtitle: Maybe<string> = null
  uuid: string = ''
  websiteUrl: Maybe<string> = null

  constructor(episode: Episode) {
    const { series, ...rest } = episode
    Object.assign(this, rest)
    this.seriesUuid = series?.uuid || null
    this.imageUrl = series?.imageUrl || null
    this.seriesName = series?.name || null
    this.authorName = series?.authorName || null
  }

  static isPlayable(episode: Partial<Episode> = {}): boolean {
    const { audioUrl, name, uuid } = episode
    return Boolean(audioUrl && name && uuid)
  }

  toDto(): EpisodeDto {
    return {
      uuid: this.uuid,
      audioUrl: this.audioUrl,
      authorName: this.authorName,
      completed: this.completed,
      datePublished: this.datePublished,
      description: this.description,
      duration: this.duration,
      episodeNumber: this.episodeNumber,
      imageUrl: this.imageUrl,
      listens: this.listens,
      name: this.name,
      seriesUuid: this.seriesUuid,
      seriesName: this.seriesName,
      seasonNumber: this.seasonNumber,
      subtitle: this.subtitle,
      websiteUrl: this.websiteUrl
    }
  }
}

export function createEpisode(episode: Episode) {
  return new Episode(episode)
}
