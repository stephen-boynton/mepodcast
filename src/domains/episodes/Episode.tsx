'use client'
import { Heading, Text } from '@radix-ui/themes'
import styles from './Episode.style.module.scss'
import Image from 'next/image'
import { PodcastPlayer } from '../podcastPlayer/PodcastPlayer'
import { LinkOut } from '@/components/Link/LinkOut'
import { usePodcastPlayer } from '../podcastPlayer/usePodcastPlayer'
import Link from 'next/link'
import { clean } from '@/utils'

export const EpisodeDetail = () => {
  const {
    episode,
    loading,
    error,
    playerRef,
    handlePause,
    handlePlay,
    handleListening,
    handleLoaded,
    handleCompleted
  } = usePodcastPlayer()

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className={styles.container}>
      <Heading className={styles.title} size="6" as="h2">
        <Link href={`/series/${episode.series.uuid}`}>
          {episode.series.name}
        </Link>
      </Heading>
      <Heading className={styles.subtitle} size="5" as="h3">
        <LinkOut href={episode.websiteUrl || episode.series.websiteUrl}>
          Learn More
        </LinkOut>
      </Heading>
      <div className={styles.episodeTimer}>
        <Text className={styles.seasonEpisode}>
          Season {episode.seasonNumber} Episode {episode.episodeNumber}
        </Text>
        <Text>{new Date(episode.datePublished).toDateString()}</Text>
      </div>
      <div className={styles.podcastPlayerContainer}>
        <Image
          priority
          src={episode.imageUrl || episode.series.imageUrl}
          alt={episode.name}
          width={100}
          height={100}
          style={{ width: '100%', height: 'auto' }}
        />
        <div>
          <PodcastPlayer
            handlePause={handlePause}
            handlePlay={handlePlay}
            handleListening={handleListening}
            handleLoaded={handleLoaded}
            handleCompleted={handleCompleted}
            src={episode.audioUrl}
            playerRef={playerRef}
          />
        </div>
        <Text
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: clean(episode.description) }}
        />
      </div>
    </div>
  )
}
