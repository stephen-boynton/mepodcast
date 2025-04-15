export type ProgressDto = {
  id?: number
  episodeUuid: string
  episodeProgress: number
  seriesUuid: string
  completed: boolean
}

export class Progress {
  id?: number
  episodeUuid: string = ''
  episodeProgress: number = 0
  seriesUuid: string = ''
  completed: boolean = false

  constructor(progress: ProgressDto) {
    Object.assign(this, progress)
  }

  updateProgress(time: number) {
    this.episodeProgress = time
  }

  toDto(): ProgressDto {
    return {
      id: this.id,
      completed: this.completed,
      episodeUuid: this.episodeUuid,
      episodeProgress: this.episodeProgress,
      seriesUuid: this.seriesUuid
    }
  }
}

export const createProgress = (progress: ProgressDto) => {
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
