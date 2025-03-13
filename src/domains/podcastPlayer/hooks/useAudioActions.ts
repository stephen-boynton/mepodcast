import { Episode } from '@/models/Episode'
import { Maybe } from '@/types/shared'
import { useCallback } from 'react'
import { PodcastPlayer } from '../Player'

export const useAudioActions = ({
  drawerState,
  minimizeDrawer,
  setEpisode,
  player
}: {
  drawerState: string
  isInitialized: boolean
  setEpisode: (episode: Maybe<Episode>) => void
  minimizeDrawer: () => void
  player: Maybe<PodcastPlayer>
}) => {
  const handlePlay = useCallback(
    (episode?: Episode) => {
      if (player && !player.isPlaying) {
        if (drawerState !== 'open' && drawerState !== 'minimized') {
          minimizeDrawer()
        }

        if (episode) {
          setEpisode(episode)
        }

        player.play(episode)
      }
    },
    [player, drawerState, minimizeDrawer, setEpisode]
  )

  const handleListenInterval = useCallback(() => {
    if (player) {
      player.saveProgress()
    }
  }, [player])

  const handlePause = useCallback(() => {
    if (player) {
      player.pause()
      player.saveProgress()
    }
  }, [player])

  const handleCompleted = useCallback(() => {
    if (player) {
      player.complete()
    }
  }, [, player])

  return {
    handlePlay,
    handleListenInterval,
    handlePause,
    handleCompleted
  }
}
