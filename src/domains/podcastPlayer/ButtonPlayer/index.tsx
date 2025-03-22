'use client'
import FloatingPlayButton from '@/components/FloatingPlayButton'
import { useDrawerPlayer } from '../hooks/useDrawerPlayer'

export const ButtonPlayer = () => {
  const { player, drawerState, minimizeDrawer, isPlaying } = useDrawerPlayer()
  const showButton = drawerState === 'button'

  const onClick = () => {
    if (player?.isPlaying()) {
      console.log('pausing')
      player.pause()
      return
    }

    player?.play()
  }

  return (
    showButton && (
      <FloatingPlayButton
        onSwipeUp={minimizeDrawer}
        isPlaying={isPlaying}
        onClick={onClick}
      />
    )
  )
}
