'use client'
import FloatingPlayButton from '@/components/FloatingPlayButton'
import { useDrawerPlayer } from '../hooks/useDrawerPlayer'

export const ButtonPlayer = () => {
  const { player, drawerState, minimizeDrawer } = useDrawerPlayer()
  const showButton = drawerState === 'button'
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (player?.isPlaying()) {
      player.pause()
      return
    }

    player?.play()
  }
  return (
    showButton && (
      <FloatingPlayButton
        onSwipeUp={minimizeDrawer}
        isPlaying={player?.isPlaying()}
        onClick={onClick}
      />
    )
  )
}
