import { getProgress, saveProgress as _saveProgress } from '@/db/operations'
import { createBlankProgress, Progress } from '@/models/Progress'
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'

type UseSaveProgressProps = {
  episodeUuid: string
  seriesUuid: string
}

export const useSaveProgress = ({
  episodeUuid,
  seriesUuid
}: UseSaveProgressProps) => {
  const [progress, setProgress] = useState<Progress>()
  const [startingTime, setStartingTime] = useState(0)
  const [initialized, setInitialized] = useState(false)

  const savedProgress = useLiveQuery(async () => {
    if (!episodeUuid) return
    return await getProgress(episodeUuid)
  }, [episodeUuid])

  useEffect(() => {
    if (savedProgress && !initialized) {
      setInitialized(true)
      setStartingTime(Math.round(savedProgress.episodeProgress))
    }
  }, [initialized, savedProgress, startingTime])

  useEffect(() => {
    if (savedProgress) {
      setProgress(savedProgress)
    }

    if (!progress) {
      setProgress(createBlankProgress())
    }
  }, [savedProgress, progress])

  const saveProgress = (timestamp?: number) => {
    setProgress({
      ...progress,
      episodeUuid,
      seriesUuid,
      episodeProgress: timestamp
    } as Progress)

    _saveProgress({
      ...progress,
      episodeUuid,
      seriesUuid,
      episodeProgress: timestamp
    } as Progress)
  }

  const saveCompleted = () => {
    setProgress({
      ...progress,
      episodeUuid,
      seriesUuid,
      episodeProgress: 100,
      completed: true
    } as Progress)

    _saveProgress({
      ...progress,
      episodeUuid,
      seriesUuid,
      episodeProgress: 100,
      completed: true
    } as Progress)
  }

  return {
    progress,
    startingTime,
    saveProgress,
    saveCompleted
  }
}
