import { Maybe } from '@/types/shared'
import type { Series } from './Series'

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
}

export function createEpisode(episode: Episode) {
  return new Episode(episode)
}
