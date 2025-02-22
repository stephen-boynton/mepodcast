import { useRef } from "react"
import H5AudioPlayer from "react-h5-audio-player"

export const usePodcastAudioElement = () => {
  const playerRef = useRef<H5AudioPlayer>(null)

  return playerRef
}
