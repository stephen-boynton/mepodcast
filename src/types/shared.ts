import type { Episode, EpisodeDto } from '@/models/Episode'
import { Playlist } from '@/models/Playlist'
import { PlaylistDto } from '@/models/Playlist'
import type { Series } from '@/models/Series'

export type Maybe<T> = T | null

export type DisplayType = 'series' | 'episode'
export type Content = Series | Episode
export type EpisodeShared = Episode | EpisodeDto
// export type SeriesShared = Series | SeriesDto;
export type PlaylistShared = Playlist | PlaylistDto

export type DownloadStatus = 'pending' | 'downloading' | 'downloaded' | 'error'
export type DownloadError = 'network' | 'storage' | 'unknown'

export type DownloadProgress = {
  status: DownloadStatus
  error?: DownloadError
  progress?: number
}
