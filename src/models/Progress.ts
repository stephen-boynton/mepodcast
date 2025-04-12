import { saveProgress } from '@/db/operations'

export type ProgressValues = {
  episodeUuid: string
  episodeProgress: number
  seriesUuid: string
  completed: boolean
}

export class Progress {
  episodeUuid: string = ''
  episodeProgress: number = 0
  seriesUuid: string = ''
  completed: boolean = false

  constructor(progress: ProgressValues) {
    Object.assign(this, progress)
  }

  updateProgress(time: number) {
    this.episodeProgress = time
    this.save()
  }

  toDto() {
    return {
      episodeUuid: this.episodeUuid,
      episodeProgress: this.episodeProgress,
      seriesUuid: this.seriesUuid
    }
  }

  save() {
    saveProgress(this)
  }
}

export const createProgress = (progress: Progress) => {
  return new Progress(progress)
}

export const createBlankProgress = () => {
  return new Progress({
    episodeUuid: '',
    seriesUuid: '',
    episodeProgress: 0,
    completed: false
  })
}
