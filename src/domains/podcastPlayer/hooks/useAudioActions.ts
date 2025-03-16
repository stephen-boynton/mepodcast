import { Episode } from '@/models/Episode'
import { Maybe } from '@/types/shared'
import { useCallback } from 'react'
import { PodcastPlayer } from '../../../models/Player'

export const useAudioActions = ({
  drawerState,
  //   minimizeDrawer,
  openDrawer,
  player
}: {
  drawerState: string
  isInitialized: boolean
  minimizeDrawer: () => void
  openDrawer: () => void
  player: Maybe<PodcastPlayer>
}) => {
  const handlePlay = useCallback(
    (episode?: Episode) => {
      if (player && !player.isPlaying()) {
        if (drawerState !== 'open' && drawerState !== 'minimized') {
          openDrawer()
        }

        player.play(episode)
      }
    },
    [player, drawerState, openDrawer]
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
  }, [player])

  return {
    handlePlay,
    handleListenInterval,
    handlePause,
    handleCompleted
  }
}
