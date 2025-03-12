import { useState } from "react"

export const usePodcastStatus = () => {
  const [isPaused, setIsPaused] = useState(true)

  return {
    isPaused,
    setIsPaused,
  }
}
