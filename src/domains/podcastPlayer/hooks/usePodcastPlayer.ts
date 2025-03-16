'use client'
import { useState } from 'react'
import { PodcastPlayer } from '../../../models/Player'
import H5AudioPlayer from 'react-h5-audio-player'
import { Maybe } from '@/types/shared'

export const usePodcastPlayer = () => {
  const [player, setPlayer] = useState<Maybe<PodcastPlayer>>(null)
  const [initialized, setInitialized] = useState(false)

  const initializePlayer = (element: H5AudioPlayer) => {
    if (initialized) return
    setPlayer(PodcastPlayer.create(element?.audio.current))
    setInitialized(true)
  }

  return {
    player,
    initializePlayer,
    initialized
  }
}
