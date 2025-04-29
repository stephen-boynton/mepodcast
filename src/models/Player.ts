import { ProgressData } from '@/db/Database'
import { Logger } from '@/lib/Logger'
import { Episode } from '@/models/Episode'
import { createProgress, Progress } from '@/models/Progress'
import { ProgressService } from '@/services/ProgressService'
import { EpisodeShared, Maybe } from '@/types/shared'
import { Dispatch, SetStateAction } from 'react'

const fetchAndSaveEpisode = async (episode: EpisodeShared) => {
  if (!episode.audioUrl) {
    Logger.error('Player: No episode to download')
    return
  }

  const response = await fetch(episode.audioUrl)
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)

  episode.audioUrl = url
  return episode
}

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
      console.log('hererererre')
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

  get isPlaying() {
    return !this.#player.paused
  }

  set currentEpisode(episode: Episode | undefined) {
    this.#currentEpisode = episode
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

  async initialize(initialEpisode: Maybe<Episode>) {
    this.clear()
    Logger.debug('Player: Initializing player', initialEpisode)

    if (!initialEpisode?.audioUrl) {
      Logger.warn('Player: No episode to initialize')
      return
    }

    this.#player.src = initialEpisode.audioUrl
    this.currentEpisode = initialEpisode
    await this.load()
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
      return
    }
    Logger.debug('Player: Playing episode', episode)
    this.#currentEpisode = episode
    this.onPlayStateChange?.(true)
    await this.load(episode).then(() => this.#player.play())
  }

  async load(_episode?: Episode) {
    this.#player.src = ''
    const episode = _episode || this.#currentEpisode

    if (!episode?.audioUrl) {
      Logger.error('Player: no episdoe to load')
      return
    }

    const currentProgress = await ProgressService.getProgress(episode?.uuid)

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

      await this.saveProgress()
    }

    Logger.debug('Current progress', currentProgress)

    this.#player.src = episode.audioUrl
    this.onSrcChange?.(episode.audioUrl)
    Logger.debug('Loading episode', episode)

    this.onLoadedChange?.(true)
    await this.#player.load()
  }

  isPlayingSameEpisode(episodeUuid: string) {
    if (!this.#currentEpisode) return false
    return this.isPlaying && this.#currentEpisode?.uuid === episodeUuid
  }

  async complete() {
    if (!this.#progress) return
    Logger.debug('Completing episode', this.#progress)
    this.#player.currentTime = this.#player.duration
    this.onPlayStateChange?.(false)
    await ProgressService.updateProgress(
      createProgress({
        ...this.#progress,
        completed: true,
        episodeProgress: this.#player.duration
      })
    )
  }

  async saveProgress() {
    if (!this.#progress) return
    Logger.debug('Saving progress', this.#progress)
    this.#progress.episodeProgress = this.#player.currentTime
    await ProgressService.updateProgress(this.#progress)
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

  async download(episode: EpisodeShared) {
    if (!episode.audioUrl) {
      Logger.error('Player: No episode to download')
      return
    }

    const episodeAudio = await fetchAndSaveEpisode(episode)
    console.log({ episodeAudio })
  }

  clear() {
    this.#player.src = ''
    this.#player.currentTime = 0
    this.currentEpisode = undefined
    this.#progress = undefined
    this.isInitialized = false
  }
}
