import H5AudioPlayer from 'react-h5-audio-player'
import AudioPlayer from 'react-h5-audio-player'
import styles from './PodcastPlayer.style.module.scss'
import 'react-h5-audio-player/lib/styles.css'
import { Maybe } from 'graphql/jsutils/Maybe'
import { Box } from '@radix-ui/themes'
import { Logger } from '@/lib/Logger'

type PodcastPlayerProps = {
  src: Maybe<string>
  handlePause: () => void
  handlePlay: () => void
  handleListening: () => void
  handleLoaded: () => void
  handleCompleted: () => void
  initializePlayer: (player: H5AudioPlayer) => void
  isInitialized: boolean
}

export const PodcastPlayer = ({
  src,
  initializePlayer,
  handlePause,
  handlePlay,
  handleListening,
  handleLoaded,
  handleCompleted,
  isInitialized
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
        src={src || undefined}
        ref={(instance) => {
          if (instance && !isInitialized) {
            Logger.log('Initializing Player')
            initializePlayer(instance)
          }
        }}
      />
    </Box>
  )
}
