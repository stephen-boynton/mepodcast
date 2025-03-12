import { Logger } from '@/lib/Logger'
import { Episode } from '@/models/Episode'
import { Maybe } from '@/types/shared'
import { useCallback } from 'react'
import { PodcastPlayer } from '../Player'

export const useAudioActions = ({
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
}: {
  drawerState: string
  episode: Maybe<Episode>
  isPlaying: boolean
  minimizeDrawer: () => void
  player: Maybe<PodcastPlayer>
  saveCompleted: () => void
  saveProgress: (time: number) => void
  setEpisode: (episode: Episode) => void
  setIsPlaying: (value: boolean) => void
  startingTime: number
}) => {
  const handlePlayWithNewSrc = useCallback(
    async (_episode: Episode) => {
      setEpisode(_episode)
      const src = _episode.audioUrl
      if (drawerState !== 'open' && drawerState !== 'minimized') {
        minimizeDrawer()
      }

      if (src && player) {
        if (isPlaying) return
        player.currentTime = startingTime
        await player.load(src)
        setIsPlaying(true)
        await player.play()
      } else {
        Logger.error(`Episode src ${src} not found`)
      }
    },
    [
      drawerState,
      setIsPlaying,
      isPlaying,
      minimizeDrawer,
      player,
      startingTime,
      setEpisode
    ]
  )

  const handlePlay = useCallback(() => {
    if (player) {
      player.play()
      setIsPlaying(true)
    }
  }, [player, setIsPlaying])

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
  }, [player, saveProgress, setIsPlaying])

  const handleCompleted = useCallback(() => {
    if (episode) {
      setIsPlaying(false)
      saveCompleted()
    }
  }, [episode, saveCompleted, setIsPlaying])

  return {
    handlePlayWithNewSrc,
    handlePlay,
    handleListenInterval,
    handlePause,
    handleCompleted
  }
}
