import { getProgress, saveProgress as _saveProgress } from '@/db/operations'
import { Logger } from '@/lib/Logger'
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
  const [progress, setProgress] = useState<Progress | null>(null)
  const [startingTime, setStartingTime] = useState(0)
  const [initialized, setInitialized] = useState(false)

  // Retrieve saved progress from IndexedDB
  const savedProgress = useLiveQuery(async () => {
    if (!episodeUuid || progress) return null
    Logger.log('Retrieving progress', episodeUuid)
    const _progress = await getProgress(episodeUuid)
    setInitialized(true)
    return _progress
  }, [episodeUuid])

  // do initial update
  useEffect(() => {
    if (initialized && savedProgress && !progress) {
      Logger.log('Initializing Start Time')
      setStartingTime(Math.round(savedProgress.episodeProgress ?? 0))
      setProgress(savedProgress)
    } else if (initialized && !savedProgress && !progress) {
      Logger.log('Creating new progress')
      const newProgress = createBlankProgress()
      setProgress(newProgress)
    }
  }, [initialized, savedProgress, progress])

  // Function to update and save progress
  const saveProgress = (timestamp: number = 0) => {
    if (!initialized) return

    setProgress((prev) => {
      const updatedProgress = {
        ...prev,
        episodeUuid,
        seriesUuid,
        episodeProgress: timestamp
      } as Progress

      _saveProgress(updatedProgress)
      return updatedProgress
    })
  }

  // Function to mark an episode as completed
  const saveCompleted = () => {
    setProgress((prev) => {
      const updatedProgress = {
        ...prev,
        episodeUuid,
        seriesUuid,
        completed: true
      } as Progress

      _saveProgress(updatedProgress)
      return updatedProgress
    })
  }

  return {
    progress,
    startingTime,
    saveProgress,
    saveCompleted
  }
}
