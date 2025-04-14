import { FALSE } from '@/db/constants'
import { createEpisode, Episode } from '@/models/Episode'

export const episodeMockBuilder = ({
  id = '1',
  name
}: Pick<Episode, 'name'> & { id?: string }): Episode => {
  return createEpisode({
    name: `name-${name}-${id}`,
    audioUrl: `https://example.com/audio${id}.mp3`,
    imageUrl: `https://example.com/image${id}.jpg`,
    authorName: `Author ${id}`,
    completed: FALSE,
    datePublished: new Date().getTime(),
    description: `Description ${id}`,
    duration: 100,
    episodeNumber: 1,
    listens: 100,
    seriesName: `Series ${id}`,
    seriesUuid: `seriesUuid${id}`,
    seasonNumber: 1,
    subtitle: `Subtitle ${id}`,
    uuid: `uuid${id}`,
    websiteUrl: `https://example.com`
  })
}

export const episodeMock: Episode = episodeMockBuilder({
  id: '1',
  name: 'Episode 1'
})

export const episodesMock: Episode[] = [
  episodeMockBuilder({ id: '1', name: 'Episode 1' }),
  episodeMockBuilder({ id: '2', name: 'Episode 2' }),
  episodeMockBuilder({ id: '3', name: 'Episode 3' })
]
