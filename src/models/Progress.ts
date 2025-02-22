export class Progress {
  episodeUuid: string = ""
  episodeProgress: number = 0
  seriesUuid: string = ""
  completed: boolean = false

  constructor(progress: Progress) {
    Object.assign(this, progress)
  }
}

export const createProgress = (progress: Progress) => {
  return new Progress(progress)
}

export const createBlankProgress = () => {
  return new Progress({
    episodeUuid: "",
    seriesUuid: "",
    episodeProgress: 0,
    completed: false,
  })
}
