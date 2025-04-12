import 'react-h5-audio-player/lib/styles.css'
import H5AudioPlayer from 'react-h5-audio-player'
import AudioPlayer from 'react-h5-audio-player'
import styles from './PodcastPlayer.style.module.scss'
import { Maybe } from 'graphql/jsutils/Maybe'
import { Box } from '@radix-ui/themes'
import { Logger } from '@/lib/Logger'
import { once } from 'es-toolkit'

const initializeOnce = (
  isInitialized: boolean,
  initializePlayer: (player: H5AudioPlayer) => void
) =>
  once((instance: H5AudioPlayer) => {
    if (instance && !isInitialized) {
      Logger.debug('Creating Player instance')
      initializePlayer(instance)
    }
  })

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
    <Box className={styles.container}>
      <AudioPlayer
        className={styles.audioPlayer}
        onPause={handlePause}
        onPlay={handlePlay}
        onListen={handleListening}
        onLoadedMetaData={handleLoaded}
        onEnded={handleCompleted}
        listenInterval={5000}
        src={src || undefined}
        ref={(instance) =>
          initializeOnce(
            isInitialized,
            initializePlayer
          )(instance as H5AudioPlayer)
        }
      />
    </Box>
  )
}
