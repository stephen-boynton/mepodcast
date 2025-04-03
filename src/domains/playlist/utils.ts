import { Episode } from '@/models/Episode'
import { PlaylistListItem } from './PlaylistList'
import { Playlist } from '@/models/Playlist'

export const transformToPlaylistListItem = (
  toTransform: Episode | Playlist
): PlaylistListItem => {
  const isEpisode = toTransform instanceof Episode
  return {
    heading: toTransform.name || '',
    id: (isEpisode ? toTransform.uuid : `${toTransform.id}`) || '',
    content:
      (isEpisode
        ? toTransform.authorName
        : `${toTransform.episodes.length} Episodes`) || ''
  }
}
