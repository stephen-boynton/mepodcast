import { Maybe } from '@/types/shared'
import { useEffect, useRef, useState } from 'react'
import H5AudioPlayer from 'react-h5-audio-player'

export const usePodcastAudioElement = () => {
  const [player, setPlayer] = useState<Maybe<H5AudioPlayer>>(null)
  const playerRef = useRef<H5AudioPlayer>(null)

  useEffect(() => {
    if (!playerRef.current) {
      return
    }
    setPlayer(playerRef.current)
  }, [playerRef])

  return {
    playerRef,
    player
  }
}
