'use client'
import {
  useCallback,
  useContext,
  useMemo,
  useState,
  createContext
} from 'react'
import { useSelectedEpisode } from '../SelectedEpisodeContext'
import { usePodcastPlayer } from '../usePodcastPlayer'
import { useSaveProgress } from '../useSaveProgress'
import { Logger } from '@/lib/Logger'
import {
  useSwipeable,
  SwipeableHandlers,
  SwipeEventData
} from 'react-swipeable'
import { Maybe } from 'graphql/jsutils/Maybe'
import H5AudioPlayer from 'react-h5-audio-player'

export type DrawerState = 'open' | 'minimized' | 'closed'

const HEIGHTS: Record<DrawerState, number> = {
  open: '90vh',
  minimized: 125,
  closed: 0
}

type DrawerPlayerState = {
  closeDrawer: () => void
  drawerHeight: number
  drawerState: DrawerState
  handleCompleted: () => void
  handleListenInterval: () => void
  handlePause: () => void
  handlePlay: () => void
  minimizeDrawer: () => void
  openDrawer: () => void
  playerRef: React.RefObject<Maybe<H5AudioPlayer>>
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
  minimizeDrawer: () => {},
  openDrawer: () => {},
  playerRef: {} as React.RefObject<Maybe<H5AudioPlayer>>,
  setDrawerState: () => {},
  swipeHandlers: {} as SwipeableHandlers
})

export const DrawerStateProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [drawerHeight, setHeight] = useState(HEIGHTS.closed)
  const [drawerState, setDrawerState] = useState<DrawerState>('closed')
  const [initialized, setInitialized] = useState(false)
  const { episode } = useSelectedEpisode()
  const { player, playerRef } = usePodcastPlayer()
  const [isPlaying, setIsPlaying] = useState<boolean>(
    Boolean(player && player.isLoaded() && !player.isPaused)
  )

  const openDrawer = useCallback(() => {
    setHeight(HEIGHTS.open)
    setDrawerState('open')
  }, [])

  const closeDrawer = useCallback(() => {
    setHeight(HEIGHTS.closed)
    setDrawerState('closed')
  }, [])

  const minimizeDrawer = useCallback(() => {
    setHeight(HEIGHTS.minimized)
    setDrawerState('minimized')
  }, [])

  const handleSwipeUp = useCallback(() => {
    if (drawerState === 'closed') {
      minimizeDrawer()
    } else {
      openDrawer()
    }
  }, [minimizeDrawer, openDrawer, drawerState])

  const handleSwipeDown = useCallback(() => {
    if (drawerState === 'minimized') {
      closeDrawer()
    } else {
      minimizeDrawer()
    }
  }, [closeDrawer, minimizeDrawer, drawerState])

  const swipeHandlers = useSwipeable({
    preventScrollOnSwipe: true,
    onSwiping: (event: SwipeEventData) => {
      if (event.deltaY < 0) {
        handleSwipeUp()
      } else {
        handleSwipeDown()
      }
    }
  })

  const { saveCompleted, saveProgress, startingTime } = useSaveProgress({
    episodeUuid: episode?.uuid || '',
    seriesUuid: episode?.seriesUuid || ''
  })

  const handlePlay = useCallback(() => {
    const src = episode?.audioUrl || ''

    if (src && player) {
      if (isPlaying) return
      if (!initialized) {
        setInitialized(true)
        player.currentTime = startingTime
        player.load(src)
      }

      if (drawerState !== 'open' && drawerState !== 'minimized') {
        minimizeDrawer()
      }

      setIsPlaying(true)
      player.play()
    } else {
      Logger.error(`Episode src ${src} not found`)
    }
  }, [
    drawerState,
    episode,
    initialized,
    isPlaying,
    minimizeDrawer,
    player,
    startingTime
  ])

  const handleListenInterval = useCallback(() => {
    if (episode && player) {
      saveProgress(player.currentTime)
    }
  }, [episode, player, saveProgress])

  const handlePause = useCallback(() => {
    if (player) {
      player.pause()
      setIsPlaying(false)
      saveProgress(player.currentTime)
    }
  }, [player, saveProgress])

  const handleCompleted = useCallback(() => {
    if (episode) {
      setIsPlaying(false)
      saveCompleted()
    }
  }, [episode, saveCompleted])

  const value = useMemo(
    () => ({
      closeDrawer,
      drawerHeight,
      drawerState,
      handleCompleted,
      handleListenInterval,
      handlePause,
      handlePlay,
      isPlaying,
      minimizeDrawer,
      openDrawer,
      playerRef,
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
      handlePlay,
      isPlaying,
      minimizeDrawer,
      openDrawer,
      playerRef,
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
