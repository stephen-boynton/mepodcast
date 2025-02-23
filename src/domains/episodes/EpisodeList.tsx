import styles from './EpisodeList.style.module.scss'
import { Heading } from '@radix-ui/themes'
import { ListCard } from '@/components/ListCard'
import { Progress } from '@/models/Progress'
import { Episode } from '@/models/Episode'

export const EpisodeList = ({
  progress,
  seriesId,
  episodes,
  imgSrc,
  sentryRef,
  loading,
  hasMorePages
}: {
  progress: Progress[]
  seriesId: string
  episodes: Episode[]
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  sentryRef: any
  loading: boolean
  hasMorePages: boolean
  imgSrc: string
}) => {
  return (
    <div>
      <Heading as="h3" mb="4" weight="bold">
        Episodes:
      </Heading>
      <ul className={styles.container}>
        {episodes.map((episode) => {
          return (
            <ListCard
              key={episode.uuid}
              inProgress={progress?.find((p) => p.episodeUuid === episode.uuid)}
              href={`/series/${seriesId}/episodes/${episode.uuid}`}
              name={episode.name}
              description={episode.description}
              imgSrc={imgSrc}
            />
          )
        })}
        {(loading || hasMorePages) && (
          <div ref={sentryRef} className={styles.sentry}>
            Loading
          </div>
        )}
      </ul>
    </div>
  )
}
