export class PodcastPlayer {
  static #instance: PodcastPlayer
  private player: HTMLAudioElement

  private constructor(ref: HTMLAudioElement) {
    this.player = ref
  }

  public static create(player: HTMLAudioElement): PodcastPlayer {
    if (!PodcastPlayer.#instance) {
      PodcastPlayer.#instance = new PodcastPlayer(player)
    }

    return PodcastPlayer.#instance
  }

  play() {
    this.player.play()
  }

  load(url: string) {
    this.player.src = url
    this.player.load()
  }

  pause() {
    this.player.pause()
  }

  stop() {
    this.player.pause()
    this.player.currentTime = 0
  }

  download() {
    this.player.pause()
    this.player.currentTime = 0
  }

  get currentTime() {
    return this.player.currentTime
  }

  set currentTime(time: number) {
    this.player.currentTime = time
  }

  isPaused() {
    return this.player.paused
  }

  getDuration() {
    return this.player.duration
  }

  isLoaded() {
    return this.player.buffered.length > 0
  }
}
