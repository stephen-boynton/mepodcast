'use client'
import { useContext, useMemo, createContext, useState, useEffect } from 'react'
import { usePodcastPlayer } from '../usePodcastPlayer'
import { SwipeableHandlers } from 'react-swipeable'
import H5AudioPlayer from 'react-h5-audio-player'
import { Episode } from '@/models/Episode'
import { useDrawerHandlers } from '../useDrawerHnadlers'
import { useAudioActions } from '../useAudioActions'
import { Maybe } from '@/types/shared'
import { PodcastPlayer } from '../../Player'

export type DrawerState = 'open' | 'minimized' | 'closed'

type DrawerPlayerState = {
  closeDrawer: () => void
  drawerHeight: number | string
  drawerState: DrawerState
  handleCompleted: () => void
  handleListenInterval: () => void
  handlePause: () => void
  handlePlay: (episode?: Episode) => void
  initializePlayer: (player: H5AudioPlayer) => void
  isInitialized: boolean
  minimizeDrawer: () => void
  openDrawer: () => void
  player: Maybe<PodcastPlayer>
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
  initializePlayer: () => {},
  isInitialized: false,
  minimizeDrawer: () => {},
  openDrawer: () => {},
  player: null,
  setDrawerState: () => {},
  swipeHandlers: {} as SwipeableHandlers
})

export const DrawerStateProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [episode, setEpisode] = useState<Maybe<Episode>>(null)
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

  const { handleCompleted, handleListenInterval, handlePause, handlePlay } =
    useAudioActions({
      drawerState,
      minimizeDrawer,
      openDrawer,
      isInitialized: initialized,
      setEpisode,
      player
    })

  useEffect(() => {
    if (player?.isInitialized && !episode) {
      setEpisode(episode)
    }
  }, [setEpisode, player, episode])

  const value = useMemo(
    () => ({
      closeDrawer,
      drawerHeight,
      drawerState,
      episode,
      handleCompleted,
      handleListenInterval,
      handlePause,
      handlePlay,
      isPlaying: player?.isPlaying || false,
      isInitialized: initialized,
      minimizeDrawer,
      openDrawer,
      player,
      initializePlayer,
      setDrawerState,
      swipeHandlers
    }),
    [
      closeDrawer,
      drawerHeight,
      drawerState,
      episode,
      handleCompleted,
      handleListenInterval,
      handlePause,
      handlePlay,
      initialized,
      minimizeDrawer,
      openDrawer,
      player,
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
