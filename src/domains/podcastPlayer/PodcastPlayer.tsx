import H5AudioPlayer from 'react-h5-audio-player'
import AudioPlayer from 'react-h5-audio-player'
import styles from './PodcastPlayer.style.module.scss'
import 'react-h5-audio-player/lib/styles.css'
import { Maybe } from 'graphql/jsutils/Maybe'
import { Box } from '@radix-ui/themes'

type PodcastPlayerProps = {
  src: string
  handlePause: () => void
  handlePlay: () => void
  handleListening: () => void
  handleLoaded: () => void
  handleCompleted: () => void
  playerRef: React.RefObject<Maybe<H5AudioPlayer>>
}

// const Header = () => {
//   return (
//     <div className="audio-player-header">
//       <h4>Podcast Player</h4>
//     </div>
//   )
// }

export const PodcastPlayer = ({
  src,
  playerRef,
  handlePause,
  handlePlay,
  handleListening,
  handleLoaded,
  handleCompleted
}: PodcastPlayerProps) => {
  return (
    <Box className={styles.container} onTouchMove={(e) => e.preventDefault()}>
      <AudioPlayer
        className={styles.audioPlayer}
        onPause={handlePause}
        onPlay={handlePlay}
        onListen={handleListening}
        onLoadedMetaData={handleLoaded}
        onEnded={handleCompleted}
        listenInterval={5000}
        src={src}
        ref={(instance) => {
          if (instance) {
            playerRef.current = instance
          }
        }}
      />
    </Box>
  )
}
