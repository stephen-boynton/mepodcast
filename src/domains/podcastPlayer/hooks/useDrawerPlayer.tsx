'use client'
import { useContext, useMemo, useState, createContext } from 'react'
import { usePodcastPlayer } from './usePodcastPlayer'
import { useSaveProgress } from './useSaveProgress'
import { SwipeableHandlers } from 'react-swipeable'
import H5AudioPlayer from 'react-h5-audio-player'
import { Episode } from '@/models/Episode'
import { useDrawerHandlers } from './useDrawerHandlers'
import { useAudioActions } from './useAudioActions'

export type DrawerState = 'open' | 'minimized' | 'closed'

type DrawerPlayerState = {
  closeDrawer: () => void
  drawerHeight: number | string
  drawerState: DrawerState
  handleCompleted: () => void
  handleListenInterval: () => void
  handlePause: () => void
  handlePlay: () => void
  handlePlayWithNewSrc: (episode: Episode) => void
  minimizeDrawer: () => void
  openDrawer: () => void
  initializePlayer: (player: H5AudioPlayer) => void
  isInitialized: boolean
  setDrawerState: (state: DrawerState) => void
  swipeHandlers: SwipeableHandlers
}

const DrawwerPlayerState = createContext<DrawerPlayerState>({
  closeDrawer: () => {},
  drawerHeight: 0,
  drawerState: 'closed',
  handleCompleted: () => {},
  handleListenInterval: () => {},
  handlePause: () => {},
  handlePlay: () => {},
  handlePlayWithNewSrc: () => {},
  minimizeDrawer: () => {},
  openDrawer: () => {},
  initializePlayer: () => {},
  isInitialized: false,
  setDrawerState: () => {},
  swipeHandlers: {} as SwipeableHandlers
})

export const DrawerStateProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [episode, setEpisode] = useState<Episode | null>(null)
  const { player, initializePlayer, initialized } = usePodcastPlayer()

  const {
    drawerState,
    minimizeDrawer,
    openDrawer,
    closeDrawer,
    swipeHandlers,
    drawerHeight,
    setDrawerState
  } = useDrawerHandlers()

  const [isPlaying, setIsPlaying] = useState<boolean>(
    Boolean(player && player.isLoaded() && !player.isPaused)
  )

  const { saveCompleted, saveProgress, startingTime } = useSaveProgress({
    episodeUuid: episode?.uuid || '',
    seriesUuid: episode?.seriesUuid || ''
  })

  const {
    handleCompleted,
    handleListenInterval,
    handlePause,
    handlePlay,
    handlePlayWithNewSrc
  } = useAudioActions({
    drawerState,
    episode,
    isPlaying,
    minimizeDrawer,
    player,
    saveCompleted,
    saveProgress,
    setEpisode,
    setIsPlaying,
    startingTime
  })

  const value = useMemo(
    () => ({
      closeDrawer,
      drawerHeight,
      drawerState,
      handleCompleted,
      handleListenInterval,
      handlePause,
      handlePlay,
      handlePlayWithNewSrc,
      isPlaying,
      isInitialized: initialized,
      minimizeDrawer,
      openDrawer,
      initializePlayer,
      setDrawerState,
      swipeHandlers
    }),
    [
      closeDrawer,
      drawerHeight,
      drawerState,
      handleCompleted,
      handleListenInterval,
      handlePause,
      handlePlayWithNewSrc,
      handlePlay,
      initialized,
      isPlaying,
      minimizeDrawer,
      openDrawer,
      initializePlayer,
      setDrawerState,
      swipeHandlers
    ]
  )
  return (
    <DrawwerPlayerState.Provider value={value}>
      {children}
    </DrawwerPlayerState.Provider>
  )
}

export const useDrawerPlayer = () => useContext(DrawwerPlayerState)
