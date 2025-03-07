'use client'
import styles from './DrawerPlayer.style.module.scss'
import { useDrawerPlayer } from './useDrawerPlayer'
import { useSelectedEpisode } from '../SelectedEpisodeContext'
import 'react-modern-drawer/dist/index.css'
import dynamic from 'next/dynamic'
import { PodcastPlayer } from '../PodcastPlayer'

const Drawer = dynamic(() => import('react-modern-drawer'), { ssr: false })

export const DrawerPlayer: React.FC = () => {
  const { episode } = useSelectedEpisode()
  const {
    drawerState,
    handlePlay,
    handlePause,
    handleCompleted,
    playerRef,
    handleListenInterval
  } = useDrawerPlayer()

  const isOpen = drawerState === 'open' || drawerState === 'minimized'

  if (!episode) {
    return null
  }

  return (
    <Drawer
      enableOverlay={false}
      direction="bottom"
      open={isOpen}
      className={styles.container}
      size={150}
    >
      <PodcastPlayer
        handleCompleted={handleCompleted}
        handleListening={handleListenInterval}
        handlePause={handlePause}
        handlePlay={handlePlay}
        src={episode.audioUrl}
        playerRef={playerRef}
      />
    </Drawer>
  )
}
