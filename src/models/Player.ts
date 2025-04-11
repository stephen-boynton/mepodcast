import { db } from '@/db'
import { getProgress, saveProgress } from '@/db/operations'
import { removeCurrentlyPlaying } from '@/db/operations/currentlyPlaying'
import { Logger } from '@/lib/Logger'
import { Episode } from '@/models/Episode'
import { Progress } from '@/models/Progress'
import { Dispatch, SetStateAction } from 'react'

export class PodcastPlayer {
  static #instance: PodcastPlayer
  #player: HTMLAudioElement
  #currentEpisode?: Episode
  #progress?: Progress & { id?: number }
  isInitialized = false
  onPlayStateChange?: Dispatch<SetStateAction<boolean>>
  onLoadedChange?: Dispatch<SetStateAction<boolean>>

  private constructor(
    ref: HTMLAudioElement,
    onPlayStateChange?: Dispatch<SetStateAction<boolean>>,
    onLoadedChange?: Dispatch<SetStateAction<boolean>>
  ) {
    if (PodcastPlayer.#instance) {
      Logger.debug('PLayer: Returning existing player')
      return PodcastPlayer.#instance
    }
    Logger.debug('Player: Creating player', ref)
    this.#player = ref
    this.onPlayStateChange = onPlayStateChange
    this.onLoadedChange = onLoadedChange
  }

  get currentTime() {
    return this.#player.currentTime
  }

  set currentTime(time: number) {
    this.#player.currentTime = time
  }

  public static create(
    player: HTMLAudioElement,
    onPlayStateChange?: Dispatch<SetStateAction<boolean>>,
    onLoadedChange?: Dispatch<SetStateAction<boolean>>
  ): PodcastPlayer {
    if (!PodcastPlayer.#instance) {
      PodcastPlayer.#instance = new PodcastPlayer(
        player,
        onPlayStateChange,
        onLoadedChange
      )
    }

    return PodcastPlayer.#instance
  }

  isPlayingSameEpisode(episodeUuid: string) {
    return this.isPlaying && this.#currentEpisode?.uuid === episodeUuid
  }

  get isPlaying() {
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
    if (this.isPlayingSameEpisode(episode?.uuid as string)) {
      Logger.debug('Player: Already playing episode', this.#currentEpisode)
      return
    }

    if (!episode) {
      Logger.debug('Player: No episode provided')
      if (this.#currentEpisode && this.isLoaded()) {
        Logger.debug('Player: Resuming episode', this.#currentEpisode)
        this.onPlayStateChange?.(true)
        return await this.#player.play()
      }
      Logger.error('Player: No episode loaded')
    }

    if (this.#currentEpisode?.uuid !== episode?.uuid) {
      await removeCurrentlyPlaying()
    }

    Logger.debug('Player: Playing episode', episode)
    this.#currentEpisode = episode
    this.onPlayStateChange?.(true)
    await this.load(episode).then(() => this.#player.play())
  }

  async load(_episode?: Episode) {
    const episode = _episode || this.#currentEpisode
    if (!episode?.audioUrl) {
      Logger.error('Player: no episdoe to load')
      return
    }

    const currentProgress = await db.progress.get({
      episodeUuid: episode?.uuid
    })

    if (currentProgress) {
      Logger.debug('Player: Loading episode with progress', currentProgress)
      this.#player.currentTime = currentProgress.episodeProgress
      this.#progress = currentProgress
    } else {
      Logger.debug('Player: Loading episode without progress', episode)
      this.#progress = {
        episodeUuid: _episode?.uuid as string,
        seriesUuid: _episode?.seriesUuid as string,
        completed: false,
        episodeProgress: 0
      }
      this.#progress = currentProgress
    }

    if (
      this.#player.src === _episode?.audioUrl ||
      this.#player.src === this.#currentEpisode?.audioUrl
    ) {
      Logger.debug('Player: Episode already loaded')
      this.onLoadedChange?.(true)
      return
    }

    if (!episode?.audioUrl || !episode?.uuid) {
      Logger.error('Player: No episode to load')
      return
    }

    Logger.debug('Current progress', currentProgress)

    this.#player.src = episode.audioUrl
    Logger.debug('Loading episode', episode)
    this.onLoadedChange?.(true)
    await this.#player.load()
  }

  complete() {
    if (!this.#progress) return
    Logger.debug('Completing episode', this.#progress)
    this.#player.currentTime = this.#player.duration
    this.onPlayStateChange?.(false)
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
    this.onPlayStateChange?.(false)
    this.#player.pause()
  }

  stop() {
    this.onPlayStateChange?.(false)
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
