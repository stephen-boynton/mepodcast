import { EpisodeDetails } from '@/domains/episodes/types'
import { SeriesDetail } from '@/domains/series/types'
import { DisplayType } from '@/types/shared'
import sanitizeHtml from 'sanitize-html'

export const truncate = (str: string, n: number) => {
  return str?.length > n ? `${str.slice(0, n - 1)}...` : str
}

export const isSeries = (podcast: EpisodeDetails | SeriesDetail): boolean => {
  return 'episodes' in podcast
}

export const podcastDtoToDisplay = (podcast: EpisodeDetails | SeriesDetail) => {
  const isPodcastSeries = isSeries(podcast)

  if (isPodcastSeries) {
    return {
      type: 'series' as DisplayType,
      uuid: podcast.uuid,
      name: podcast.name,
      authorName: podcast.authorName,
      description: podcast.description,
      imageUrl: podcast.imageUrl,
      totalEpisodesCount: podcast.totalEpisodesCount,
      websiteUrl: podcast.websiteUrl
    }
  }

  const { series } = podcast

  return {
    type: 'episode' as DisplayType,
    uuid: podcast.uuid,
    name: podcast.name,
    authorName: series?.authorName,
    description: podcast.description || series?.description,
    imageUrl: podcast.imageUrl,
    totalEpisodesCount: series?.totalEpisodesCount,
    websiteUrl: podcast.websiteUrl
  }
}

export const clean = (dirty: string) =>
  sanitizeHtml(dirty, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li'],
    allowedAttributes: {
      a: ['href']
    }
  })

export const convertFromUnix = (unix: number) => {
  return new Date(unix * 1000).toDateString()
}
