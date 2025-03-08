'use client'
import { Box, Flex, Heading, ScrollArea, Text } from '@radix-ui/themes'
import styles from './Episode.style.module.scss'
import Image from 'next/image'
import { LinkOut } from '@/components/Link/LinkOut'
import Link from 'next/link'
import { clean } from '@/utils'
import { PauseIcon, PlayIcon } from '@radix-ui/react-icons'
import { useDrawerPlayer } from '../podcastPlayer/DrawerPlayer/useDrawerPlayer'
import { useSelectedEpisode } from '../podcastPlayer/SelectedEpisodeContext'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Episode } from '@/models/Episode'
import { Carousel } from '@/components/Carousel'

export const EpisodeDetail = () => {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)

  const { episode, setSelectedEpisode } = useSelectedEpisode()
  const { handlePlay, isPlaying, handlePause } = useDrawerPlayer()

  useEffect(() => {
    if (setSelectedEpisode) {
      if (!Episode.isPlayable(episode)) {
        setIsLoading(true)
        setSelectedEpisode(id as string)
      }

      if (id !== episode?.uuid) {
        setIsLoading(true)
        setSelectedEpisode(id as string)
      }

      if (episode?.uuid === id) {
        setIsLoading(false)
      }
    }
  }, [episode, setSelectedEpisode, id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const {
    websiteUrl,
    name,
    series,
    datePublished,
    description,
    imageUrl,
    seasonNumber,
    episodeNumber
  } = episode as Episode

  const showUrl = websiteUrl || series?.websiteUrl
  const image = imageUrl || series?.imageUrl
  const handleAction = isPlaying ? handlePause : handlePlay
  const Icon = () =>
    !isPlaying ? (
      <PlayIcon
        name="play"
        width={100}
        height={100}
        className={styles.playIcon}
      />
    ) : (
      <PauseIcon
        name="pause"
        width={100}
        height={100}
        className={styles.playIcon}
      />
    )

  return (
    <Box className={styles.container}>
      <Flex className={styles.podcastPlayerContainer} onClick={handleAction}>
        {image && (
          <Image
            priority
            src={image}
            alt={name ?? 'Podcast Image'}
            width={100}
            height={100}
            style={{ width: '100%', height: 'auto' }}
          />
        )}
        <Icon />
      </Flex>
      <Heading as="h2" size="5" my={'4'}>
        {name}
      </Heading>
      <Flex className={styles.descriptionContainer}>
        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{
            height: 300
          }}
        >
          <Box p="2" pr="8">
            {description && (
              <Text
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: clean(description) }}
              />
            )}
          </Box>
        </ScrollArea>
      </Flex>
      <Flex className={styles.episodeTimer}>
        <Text className={styles.seasonEpisode}>
          Season {seasonNumber} Episode {episodeNumber}
        </Text>
        <Text>{datePublished && new Date(datePublished).toDateString()}</Text>
      </Flex>
      {/* <Heading className={styles.title} size="6" as="h3">
        <Link href={`/series/${series?.uuid}`}>{series?.name}</Link>
      </Heading>
      <Heading className={styles.subtitle} size="5" as="h3">
        {showUrl && <LinkOut href={showUrl}>Learn More</LinkOut>}
      </Heading> */}
    </Box>
  )
}
