'use client'
import { Box, Flex, Heading, ScrollArea, Text } from '@radix-ui/themes'
import styles from './Episode.style.module.scss'
import Image from 'next/image'
import { LinkOut } from '@/components/Link/LinkOut'
import Link from 'next/link'
import { clean, convertFromUnix } from '@/utils'
import { useDrawerPlayer } from '../podcastPlayer/hooks/useDrawerPlayer'
import { useParams } from 'next/navigation'
import { Episode } from '@/models/Episode'
import { ControlPanel } from './ControlPanel'
import { useEpisodeDetail } from './useEpisodeDetails'
import { usePlaylists } from '../playlist/usePlaylists'
import { useEffect, useState } from 'react'

export const EpisodeDetail = () => {
  const [disabled, setDisabled] = useState(false)
  const { id } = useParams()
  const { handlePlay, audioSrc } = useDrawerPlayer()

  const { addAsCurrentlyPlaying, addAsPlayNext, currentEpisode } =
    usePlaylists()

  const { data: episode } = useEpisodeDetail({
    uuid: id as string
  })

  const isCurrentEpisode = currentEpisode?.uuid === episode?.uuid

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

  const handleAction = async () => {
    if (isCurrentEpisode) {
      setDisabled(true)
    } else {
      console.log('herererer')
      await addAsCurrentlyPlaying?.(episode as Episode)
      handlePlay(episode)
    }
    return
  }

  const handleAddAsPlayNext = () => {
    addAsPlayNext?.(episode as Episode)
  }

  const handleAddEpisodeToPlaylist = () => {
    addAsCurrentlyPlaying?.(episode as Episode)
  }

  useEffect(() => {
    setDisabled(audioSrc === episode?.audioUrl)
  }, [audioSrc, episode?.audioUrl])

  return (
    <Box className={styles.container}>
      <Heading className={styles.title} size="6" as="h3">
        <Link href={`/series/${series?.uuid}`}>{series?.name}</Link>
      </Heading>
      <Heading as="h2" size="5" my={'4'}>
        {name}
      </Heading>
      <Flex align="center" width="100%" justify="between">
        <Image
          src={image}
          width={205}
          height={205}
          alt={`${name} Show Image`}
          className={styles.image}
        />
        <ControlPanel
          disablePlay={disabled}
          addEpisodeToPlaylist={handleAddEpisodeToPlaylist}
          addAsPlayNext={handleAddAsPlayNext}
          handlePlayPause={handleAction}
        />
      </Flex>
      <Flex direction="column" className={styles.descriptionContainer}>
        <Heading className={styles.subtitle} size="5" as="h3">
          {showUrl && (
            <LinkOut testId="show-website" href={showUrl}>
              Show Website
            </LinkOut>
          )}
        </Heading>
        <Flex justify="between" mb="4">
          <Text className={styles.seasonEpisode}>
            Season {seasonNumber} Episode {episodeNumber}
          </Text>
          <Text>{datePublished && convertFromUnix(datePublished)}</Text>
        </Flex>
        <ScrollArea
          type="always"
          scrollbars="vertical"
          className={styles.descriptionBox}
          style={{
            maxHeight: '30vh'
          }}
        >
          <Box p="2" px="4">
            {description && (
              <Text
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: clean(description) }}
              />
            )}
          </Box>
        </ScrollArea>
      </Flex>
      <Flex className={styles.episodeTimer}></Flex>
    </Box>
  )
}
