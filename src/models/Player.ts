import { db } from '@/db'
import { saveProgress } from '@/db/operations'
import { removeCurrentlyPlaying } from '@/db/operations/currentlyPlaying'
import { Logger } from '@/lib/Logger'
import { Episode } from '@/models/Episode'
import { Progress } from '@/models/Progress'

export class PodcastPlayer {
  static #instance: PodcastPlayer
  #player: HTMLAudioElement
  #currentEpisode?: Episode
  #progress?: Progress & { id?: number }
  isInitialized = false

  private constructor(ref: HTMLAudioElement) {
    if (PodcastPlayer.#instance) {
      Logger.debug('PLayer: Returning existing player')
      return PodcastPlayer.#instance
    }
    Logger.debug('Player: Creating player', ref)
    this.#player = ref
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

  isPlayingSameEpisode(episodeUuid: string) {
    return this.isPlaying() && this.#currentEpisode?.uuid === episodeUuid
  }

  isPlaying() {
    return !this.#player.paused
  }

  async initialize(currentlyPlaying?: Episode) {
    if (currentlyPlaying?.audioUrl) {
      this.#player.src = currentlyPlaying.audioUrl
      this.#currentEpisode = currentlyPlaying
      await this.load()
    }
    this.isInitialized = true
  }

  async play(episode?: Episode) {
    if (this.isPlaying()) {
      return
    }

    if (this.isPlayingSameEpisode(episode?.uuid as string)) {
      Logger.debug('Player: Already playing episode', this.#currentEpisode)
      return
    }

    if (!episode) {
      Logger.debug('Player: No episode provided')
      if (this.#currentEpisode && this.isLoaded()) {
        Logger.debug('Player: Resuming episode', this.#currentEpisode)
        return await this.#player.play()
      }
      Logger.error('Player: No episode loaded')
    }

    if (this.#currentEpisode && this.#currentEpisode.uuid !== episode?.uuid) {
      await removeCurrentlyPlaying()
    }

    Logger.debug('Player: Playing episode', episode)
    this.#currentEpisode = episode

    await this.load(episode).then(() => this.#player.play())
  }

  async load(_episode?: Episode) {
    if (!_episode?.audioUrl && !this.#currentEpisode?.audioUrl) {
      Logger.error('Player no episdoe to load')
      return
    }

    if (
      this.#player.src === _episode?.audioUrl ||
      this.#player.src === this.#currentEpisode?.audioUrl
    ) {
      Logger.debug('Player: Episode already loaded')
      return
    }

    const episode = _episode || this.#currentEpisode

    if (!episode?.audioUrl || !episode?.uuid) {
      Logger.error('Player: No episode to load')
      return
    }

    const currentProgress = await db.progress.get({
      episodeUuid: episode?.uuid
    })

    Logger.debug('Current progress', currentProgress)

    if (currentProgress) {
      this.#player.currentTime = currentProgress.episodeProgress
      this.#progress = currentProgress
    } else {
      this.#progress = {
        episodeUuid: episode?.uuid,
        seriesUuid: episode?.seriesUuid as string,
        completed: false,
        episodeProgress: 0
      }
    }

    this.#player.src = episode.audioUrl
    Logger.debug('Loading episode', episode)
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
