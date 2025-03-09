'use client'
import { createRef, useEffect, useState } from 'react'
import H5AudioPlayer from 'react-h5-audio-player'
import { Maybe } from '@/types/shared'
import { PodcastPlayer } from './Player'

type UsePodcastPlayerReturn = {
  player: Maybe<PodcastPlayer>
  playerRef: React.RefObject<Maybe<H5AudioPlayer>>
}

export const usePodcastPlayer = (): UsePodcastPlayerReturn => {
  const [initialized, setInitialized] = useState(false)
  const [player, setPlayer] = useState<Maybe<PodcastPlayer>>(null)
  const playerRef = createRef<Maybe<H5AudioPlayer>>()

  useEffect(() => {
    if (!playerRef.current?.audio?.current) {
      return
    }

    if (!initialized) {
      console.log('initializing player')
      setInitialized(true)
      setPlayer(PodcastPlayer.create(playerRef.current.audio.current))
    }
  }, [playerRef, initialized])

  return {
    player,
    playerRef
  }
}
