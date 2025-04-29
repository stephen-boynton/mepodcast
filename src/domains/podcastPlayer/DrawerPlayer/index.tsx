'use client'
import 'react-modern-drawer/dist/index.css'
import styles from './DrawerPlayer.style.module.scss'
import { useDrawerPlayer } from '../hooks/useDrawerPlayer'
import dynamic from 'next/dynamic'
import { PodcastPlayer } from '../PodcastPlayer'
import { Box, Flex, Heading, Theme } from '@radix-ui/themes'
import { Episode } from '@/models/Episode'
import Image from 'next/image'
import { PlaylistTab } from './PlaylistTab'
import cn from 'classnames'
import { usePlaylists } from '@/domains/playlist/usePlaylists'
import { useEffect, useState } from 'react'
import { Logger } from '@/lib/Logger'

const Drawer = dynamic(() => import('react-modern-drawer'), { ssr: false })

const EpisodeDetailsTop = ({ episode }: { episode: Partial<Episode> }) => {
  return (
    <Flex direction="column" align="center" justify="center" gap="3">
      <Heading size="5" as="h2">
        {episode.name}
      </Heading>
    </Flex>
  )
}

export const DrawerPlayer: React.FC = () => {
  const {
    drawerHeight,
    drawerState,
    handleCompleted,
    handleListenInterval,
    handlePause,
    handlePlay,
    initializePlayer,
    player,
    isInitialized,
    swipeHandlers
  } = useDrawerPlayer()
  const { playlists, selectedPlaylist } = usePlaylists()
  const [episode, setEpisode] = useState<Episode | null>(null)
  const isOpen = drawerState === 'open'
  const isMinimized = drawerState === 'minimized'

  useEffect(() => {
    if (isInitialized) {
      player?.initialize(episode)
    } else {
      Logger.warn('DrawerPlayer: No episode or player')
    }
  }, [isInitialized, player, episode])

  useEffect(() => {
    if (selectedPlaylist) {
      console.log('huhhhhhh?, ', selectedPlaylist.getCurrent())
      setEpisode(selectedPlaylist.getCurrent())
    }
  }, [selectedPlaylist])
  return (
    <Drawer
      enableOverlay={false}
      direction="bottom"
      open={isOpen || isMinimized}
      size={drawerHeight}
      className={styles.container}
    >
      <Theme
        appearance="dark"
        accentColor="mint"
        grayColor="mauve"
        panelBackground="solid"
        scaling="100%"
        radius="full"
      >
        <Box height={`${drawerHeight}`} className={styles.drawer}>
          <Flex direction="column" p={isOpen ? '6' : '4'} gap="6">
            <Box
              className={cn(styles.handle, {
                [styles.minimized]: isMinimized
              })}
              {...swipeHandlers}
            />
            {isOpen && episode && <EpisodeDetailsTop episode={episode} />}
            <Flex>
              {episode?.imageUrl && (
                <Image
                  src={episode.imageUrl || ''}
                  alt={episode.name || 'Podcast Image'}
                  width={125}
                  height={125}
                />
              )}

              <PodcastPlayer
                handleCompleted={handleCompleted}
                handleListening={handleListenInterval}
                handleLoaded={() => {}}
                handlePause={handlePause}
                handlePlay={handlePlay}
                initializePlayer={initializePlayer}
                isInitialized={isInitialized}
                src={episode?.audioUrl}
              />
            </Flex>
            {isOpen && playlists && selectedPlaylist && (
              <PlaylistTab
                currentPlaylist={selectedPlaylist}
                playlists={playlists}
              />
            )}
          </Flex>
        </Box>
      </Theme>
    </Drawer>
  )
}
