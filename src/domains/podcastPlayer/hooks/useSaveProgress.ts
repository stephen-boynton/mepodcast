import { getProgress, saveProgress as _saveProgress } from '@/db/operations'
import { Logger } from '@/lib/Logger'
import { Progress } from '@/models/Progress'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'

type UseSaveProgressProps = {
  episodeUuid: string
  seriesUuid: string
}

export const useSaveProgress = ({
  episodeUuid,
  seriesUuid
}: UseSaveProgressProps) => {
  const [initialized, setInitialized] = useState(false)

  // Retrieve saved progress from IndexedDB
  const savedProgress = useLiveQuery(async () => {
    if (!episodeUuid) return null
    Logger.log('Retrieving progress', episodeUuid)
    const _progress = await getProgress(episodeUuid)
    setInitialized(true)
    return _progress
  }, [episodeUuid])

  const saveProgress = (timestamp: number = 0) => {
    if (!initialized) return

    const updatedProgress = {
      ...savedProgress,
      episodeUuid,
      seriesUuid,
      episodeProgress: timestamp
    } as Progress

    _saveProgress(updatedProgress)
    return updatedProgress
  }

  // Function to mark an episode as completed
  const saveCompleted = () => {
    const updatedProgress = {
      ...savedProgress,
      episodeUuid,
      seriesUuid,
      completed: true
    } as Progress

    _saveProgress(updatedProgress)
    return updatedProgress
  }

  return {
    savedProgress: savedProgress || null,
    saveProgress,
    saveCompleted
  }
}
