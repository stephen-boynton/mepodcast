import { useEffect } from "react"
import { useSaveProgress } from "./useSaveProgress"
import { useSelectedEpisode } from "./SelectedEpisodeContext"
import { useEpisodeDetail } from "../episodes/useEpisodeDetails"
import { usePodcastStatus } from "./usePodcastStatus"
import { useParams } from "next/navigation"
import { usePodcastAudioElement } from "./usePodcastAudioElement"

export const usePodcastPlayer = () => {
  const a = useParams()
  const episodeUuid = a.id as string
  const seriesUuid = a.sid as string
  const playerRef = usePodcastAudioElement()
  const { data, error, loading } = useEpisodeDetail({ uuid: episodeUuid })
  const { setSelectedEpisode } = useSelectedEpisode()
  const { isPaused, setIsPaused } = usePodcastStatus({ playerRef })

  useEffect(() => {
    if (data && setSelectedEpisode) {
      setSelectedEpisode(data)
    }
  }, [data, setSelectedEpisode])

  const { progress, handleSaveProgress, startingTime, handleCompleted } =
    useSaveProgress({
      episodeUuid,
      seriesUuid,
    })

  const handleLoaded = (e: Event) => {
    const event = e.target as HTMLAudioElement
    if (startingTime) {
      event.currentTime = startingTime
    }
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handlePlay = () => {
    setIsPaused(false)
  }

  const handleListening = (e: Event) => {
    if (!playerRef.current) {
      return
    }
    const event = e.target as HTMLAudioElement
    handleSaveProgress(event.currentTime)
    setIsPaused(false)
  }

  return {
    episode: data,
    error,
    handleLoaded,
    handleCompleted,
    handleListening,
    handlePause,
    handlePlay,
    isPaused,
    loading,
    playerRef,
    progress,
  }
}
