import { db } from '@/db'
import { saveProgress } from '@/db/operations'
import { Logger } from '@/lib/Logger'
import { Episode } from '@/models/Episode'
import { Progress } from '@/models/Progress'

export class PodcastPlayer {
  static #instance: PodcastPlayer
  #player: HTMLAudioElement
  #currentEpisode?: Episode
  #progress?: Progress & { id?: number }

  private constructor(ref: HTMLAudioElement) {
    this.#player = ref
  }

  get isPlaying() {
    return !this.#player.paused
  }

  get currentTime() {
    return this.#player.currentTime
  }

  set currentTime(time: number) {
    this.#player.currentTime = time
  }

  public static create(player: HTMLAudioElement): PodcastPlayer {
    if (!PodcastPlayer.#instance) {
      PodcastPlayer.#instance = new PodcastPlayer(player)
    }

    return PodcastPlayer.#instance
  }

  async play(episode?: Episode) {
    if (!episode || this.#currentEpisode?.uuid === episode?.uuid) {
      Logger.debug('Already playing episode', this.#currentEpisode)
      return await this.#player.play()
    }
    Logger.debug('Playing episode', episode)
    this.#currentEpisode = episode
    await this.load()
    await this.#player.play()
  }

  async load() {
    if (!this.#currentEpisode?.audioUrl) {
      Logger.error('No episode loaded')
      return
    }

    const currentProgress = await db.progress.get({
      episodeUuid: this.#currentEpisode.uuid
    })

    Logger.debug('Current progress', currentProgress)

    if (currentProgress) {
      this.#player.currentTime = currentProgress.episodeProgress
      this.#progress = currentProgress
    } else {
      this.#progress = {
        episodeUuid: this.#currentEpisode.uuid,
        seriesUuid: this.#currentEpisode.seriesUuid as string,
        completed: false,
        episodeProgress: 0
      }
    }

    this.#player.src = this.#currentEpisode.audioUrl
    Logger.debug('Loading episode', this.#currentEpisode)
    await this.#player.load()
  }

  complete() {
    if (!this.#progress) return
    Logger.debug('Completing episode', this.#progress)
    this.#player.currentTime = this.#player.duration
    this.saveProgress()
    db.progress.update(this.#progress.id, { completed: true })
  }

  saveProgress() {
    if (!this.#progress) return
    Logger.debug('Saving progress', this.#progress)
    this.#progress.episodeProgress = this.#player.currentTime
    saveProgress(this.#progress)
  }

  pause() {
    this.#player.pause()
  }

  stop() {
    this.#player.pause()
    this.#player.currentTime = 0
  }

  download() {
    this.#player.pause()
    this.#player.currentTime = 0
  }

  isPaused() {
    return this.#player.paused
  }

  getDuration() {
    return this.#player.duration
  }

  isLoaded() {
    return this.#player.buffered.length > 0
  }
}
