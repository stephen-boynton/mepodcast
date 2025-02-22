"use client"
import { Heading, Text } from "@radix-ui/themes"
import styles from "./Episode.style.module.scss"
import Image from "next/image"
import { PodcastPlayer } from "../podcastPlayer/PodcastPlayer"
import sanitizeHtml from "sanitize-html"
import { LinkOut } from "@/components/Link/LinkOut"
import { usePodcastPlayer } from "../podcastPlayer/usePodcastPlayer"

const clean = (dirty: string) =>
  sanitizeHtml(dirty, {
    allowedTags: ["b", "i", "em", "strong", "a", "p", "ul", "ol", "li"],
    allowedAttributes: {
      a: ["href"],
    },
  })

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
    handleCompleted,
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
        {episode.name}
      </Heading>
      <Heading className={styles.subtitle} size="5" as="h3">
        <LinkOut href={episode.websiteUrl || episode.series.websiteUrl}>
          {episode.series.name}
        </LinkOut>
      </Heading>
      <div className={styles.episodeTimer}>
        <Text className={styles.seasonEpisode}>
          Season {episode.seasonNumber} Episode {episode.episodeNumber}
        </Text>
        <Text>{new Date(episode.datePublished).toDateString()}</Text>
      </div>
      <div className={styles.podcastPlayerContainer}>
        <div>
          <Image
            src={episode.imageUrl || episode.series.imageUrl}
            alt={episode.name}
            objectFit="cover"
            width={100}
            height={100}
          />
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
