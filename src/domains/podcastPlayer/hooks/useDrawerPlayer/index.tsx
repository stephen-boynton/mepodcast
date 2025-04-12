'use client'
import { useContext, useMemo, createContext } from 'react'
import { usePodcastPlayer } from '../usePodcastPlayer'
import { SwipeableHandlers } from 'react-swipeable'
import H5AudioPlayer from 'react-h5-audio-player'
import { Episode } from '@/models/Episode'
import { useDrawerHandlers } from '../useDrawerHnadlers'
import { useAudioActions } from '../useAudioActions'
import { Maybe } from '@/types/shared'
import { PodcastPlayer } from '../../../../models/Player'

export type DrawerState = 'open' | 'minimized' | 'closed' | 'button'

type DrawerPlayerState = {
  audioSrc: string
  buttonDrawer: () => void
  closeDrawer: () => void
  drawerHeight: number | string
  drawerState: DrawerState
  handleCompleted: () => void
  handleListenInterval: () => void
  handlePause: () => void
  handlePlay: (episode?: Episode) => void
  initializePlayer: (player: H5AudioPlayer) => void
  isInitialized: boolean
  isPlaying?: boolean
  minimizeDrawer: () => void
  openDrawer: () => void
  player: Maybe<PodcastPlayer>
  setDrawerState: (state: DrawerState) => void
  swipeHandlers: SwipeableHandlers
}

const DrawwerPlayerState = createContext<DrawerPlayerState>({
  buttonDrawer: () => {},
  closeDrawer: () => {},
  drawerHeight: 0,
  drawerState: 'closed',
  handleCompleted: () => {},
  handleListenInterval: () => {},
  handlePause: () => {},
  handlePlay: () => {},
  initializePlayer: () => {},
  isInitialized: false,
  isPlaying: false,
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
  const {
    player,
    initializePlayer,
    initialized,
    isPlaying,
    isLoaded,
    audioSrc
  } = usePodcastPlayer()

  const {
    buttonDrawer,
    drawerState,
    minimizeDrawer,
    openDrawer,
    closeDrawer,
    swipeHandlers,
    drawerHeight,
    setDrawerState
  } = useDrawerHandlers({
    isLoaded,
    playerInitialized: initialized
  })

  const { handleCompleted, handleListenInterval, handlePause, handlePlay } =
    useAudioActions({
      drawerState,
      minimizeDrawer,
      openDrawer,
      isInitialized: initialized,
      player,
      audioSrc
    })

  const value = useMemo(() => {
    return {
      audioSrc,
      buttonDrawer,
      closeDrawer,
      drawerHeight,
      drawerState,
      handleCompleted,
      handleListenInterval,
      handlePause,
      handlePlay,
      isInitialized: initialized,
      isPlaying,
      minimizeDrawer,
      openDrawer,
      player,
      initializePlayer,
      setDrawerState,
      swipeHandlers
    }
  }, [
    audioSrc,
    buttonDrawer,
    closeDrawer,
    drawerHeight,
    drawerState,
    handleCompleted,
    handleListenInterval,
    handlePause,
    handlePlay,
    initialized,
    isPlaying,
    minimizeDrawer,
    openDrawer,
    player,
    initializePlayer,
    setDrawerState,
    swipeHandlers
  ])
  return (
    <DrawwerPlayerState.Provider value={value}>
      {children}
    </DrawwerPlayerState.Provider>
  )
}

export const useDrawerPlayer = () => useContext(DrawwerPlayerState)
