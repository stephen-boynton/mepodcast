import H5AudioPlayer from "react-h5-audio-player"
import AudioPlayer from "react-h5-audio-player"
import "react-h5-audio-player/lib/styles.css"

type PodcastPlayerProps = {
  src: string
  handlePause: () => void
  handlePlay: () => void
  handleListening: () => void
  handleLoaded: () => void
  handleCompleted: () => void
  playerRef: React.RefObject<H5AudioPlayer>
}

export const PodcastPlayer = ({
  src,
  playerRef,
  handlePause,
  handlePlay,
  handleListening,
  handleLoaded,
  handleCompleted,
}: PodcastPlayerProps) => {
  return (
    <>
      <AudioPlayer
        onPause={handlePause}
        onPlay={handlePlay}
        onListen={handleListening}
        onLoadedMetaData={handleLoaded}
        onEnded={handleCompleted}
        listenInterval={5000}
        src={src}
        ref={playerRef}
      />
    </>
  )
}
