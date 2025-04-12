import { db } from '@/db'
import { ProgressData } from '@/db/Database'
import { getProgress } from '@/db/operations'
import { removeCurrentlyPlaying } from '@/db/operations/currentlyPlaying'
import { Logger } from '@/lib/Logger'
import { Episode } from '@/models/Episode'
import { Progress } from '@/models/Progress'
import { Dispatch, SetStateAction } from 'react'

export class PodcastPlayer {
  static #instance: PodcastPlayer
  #player!: HTMLAudioElement
  #currentEpisode?: Episode
  #progress?: ProgressData
  isInitialized = false
  onPlayStateChange!: Dispatch<SetStateAction<boolean>>
  onLoadedChange!: Dispatch<SetStateAction<boolean>>
  onSrcChange!: Dispatch<SetStateAction<string>>

  private constructor(
    ref: HTMLAudioElement,
    onPlayStateChange: Dispatch<SetStateAction<boolean>>,
    onLoadedChange: Dispatch<SetStateAction<boolean>>,
    onSrcChange: Dispatch<SetStateAction<string>>
  ) {
    if (PodcastPlayer.#instance) {
      Logger.debug('PLayer: Returning existing player')
      return PodcastPlayer.#instance
    }
    Logger.debug('Player: Creating player', ref)
    this.#player = ref
    this.onPlayStateChange = onPlayStateChange
    this.onLoadedChange = onLoadedChange
    this.onSrcChange = onSrcChange
  }

  get currentTime() {
    return this.#player.currentTime
  }

  set currentTime(time: number) {
    this.#player.currentTime = time
  }

  get src() {
    return this.#player.src
  }

  set src(src: string) {
    this.#player.src = src
  }

  public static create(
    player: HTMLAudioElement,
    onPlayStateChange: Dispatch<SetStateAction<boolean>>,
    onLoadedChange: Dispatch<SetStateAction<boolean>>,
    onSrcChange: Dispatch<SetStateAction<string>>
  ): PodcastPlayer {
    if (!PodcastPlayer.#instance) {
      PodcastPlayer.#instance = new PodcastPlayer(
        player,
        onPlayStateChange,
        onLoadedChange,
        onSrcChange
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
    Logger.debug('Player: Initializing player', currentlyPlaying)

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
        this.onPlayStateChange(true)
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

    const currentProgress = episode?.uuid
      ? await getProgress(episode?.uuid)
      : undefined

    if (currentProgress) {
      let progress = currentProgress

      if (!(progress instanceof Progress)) {
        progress = new Progress(progress)
      }

      Logger.debug('Player: Loading episode with progress', currentProgress)

      this.#player.currentTime = currentProgress.episodeProgress
      this.#progress = currentProgress
    } else {
      Logger.debug('Player: Loading episode without progress', episode)

      this.#progress = new Progress({
        episodeUuid: episode.uuid as string,
        seriesUuid: episode.seriesUuid as string,
        completed: false,
        episodeProgress: 0
      })

      this.#progress.save()
    }

    if (
      this.#player.src === episode?.audioUrl ||
      this.#player.src === this.#currentEpisode?.audioUrl
    ) {
      Logger.debug('Player: Episode already loaded')
      this.onLoadedChange?.(true)
      this.onSrcChange?.(this.#player.src)
      return
    }

    if (!episode?.audioUrl || !episode?.uuid) {
      Logger.error('Player: No episode to load')
      return
    }

    Logger.debug('Current progress', currentProgress)

    this.#player.src = episode.audioUrl
    this.onSrcChange?.(episode.audioUrl)
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
    this.#progress.save()
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
