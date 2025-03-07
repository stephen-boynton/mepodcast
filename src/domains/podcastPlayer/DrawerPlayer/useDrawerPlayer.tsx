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
import { Episode } from '@/models/Episode'
import { Logger } from '@/lib/Logger'
import { set } from 'es-toolkit/compat'

export type DrawerState = 'open' | 'minimized' | 'closed'

const DrawwerPlayerState = createContext({
  drawerState: 'closed',
  setDrawerState: () => {},
  playerRef: null,
  handlePlay: () => {},
  handlePause: () => {},
  handleCompleted: () => {},
  handleListenInterval: () => {}
})

export const DrawerStateProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [drawerState, setDrawerState] = useState<DrawerState>('closed')
  const [initialized, setInitialized] = useState(false)
  const { episode, setSelectedEpisode } = useSelectedEpisode()
  const { player, playerRef } = usePodcastPlayer()
  const [isPlaying, setIsPlaying] = useState<boolean>(
    Boolean(player && player.isLoaded() && !player.isPaused)
  )

  const { saveCompleted, saveProgress, startingTime } = useSaveProgress({
    episodeUuid: episode?.uuid || '',
    seriesUuid: episode?.seriesUuid || ''
  })

  const handlePlay = useCallback(
    (episodeDetails?: Partial<Episode>) => {
      if (!episode && episodeDetails?.uuid && setSelectedEpisode) {
        setSelectedEpisode(episodeDetails as Episode)
      }

      const src = episodeDetails?.audioUrl || episode?.audioUrl || ''

      if (src && player) {
        if (isPlaying) return
        if (!initialized) {
          setInitialized(true)
          player.currentTime = startingTime
          player.load(src)
        }

        if (drawerState !== 'open' && drawerState !== 'minimized') {
          setDrawerState('minimized')
        }

        setIsPlaying(true)
        player.play()
      } else {
        Logger.error('Player or src not found')
      }
    },
    [episode, setSelectedEpisode, player, initialized, startingTime]
  )

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
      isPlaying,
      drawerState,
      handleCompleted,
      handleListenInterval,
      handlePause,
      handlePlay,
      playerRef,
      setDrawerState: setDrawerState
    }),
    [
      handleCompleted,
      handleListenInterval,
      handlePause,
      handlePlay,
      isPlaying,
      playerRef,
      setDrawerState,
      drawerState
    ]
  )
  return (
    <DrawwerPlayerState.Provider value={value}>
      {children}
    </DrawwerPlayerState.Provider>
  )
}

export const useDrawerPlayer = () => useContext(DrawwerPlayerState)
