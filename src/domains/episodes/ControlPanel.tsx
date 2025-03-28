import {
  CardStackPlusIcon,
  DownloadIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon
} from '@radix-ui/react-icons'
import { Button, ButtonProps, Flex } from '@radix-ui/themes'
import styles from './ControlPanel.style.module.scss'
import { JSX } from 'react'
import { PlaylistContext } from '../playlist/usePlaylists'

const createButtons = ({
  handlePlayPause,
  addAsPlayNext,
  disablePlay
}: {
  isPlaying: boolean
  handlePlayPause: () => void
  addAsPlayNext: () => void
  disablePlay?: boolean
}) => [
  {
    disabled: disablePlay,
    action: 'Play',
    variant: 'primary',
    handleAction: handlePlayPause,
    icon: <PlayIcon name="play" width={25} height={25} />
  },
  {
    action: 'Play Next',
    variant: 'outline',
    handleAction: addAsPlayNext,
    icon: <CardStackPlusIcon name="pause" width={25} height={25} />
  },
  {
    action: 'Playlist',
    variant: 'outline',
    handleAction: () => console.log('Playlist'),
    icon: <PlusIcon name="download" width={25} height={25} />
  },
  {
    action: 'Download',
    variant: 'outline',
    icon: <DownloadIcon name="download" width={25} height={25} />
  }
]

const BuildButton = ({
  variant,
  size,
  icon,
  handleAction,
  action,
  disabled
}: ButtonProps & {
  handleAction: () => void
  action: string
  icon: JSX.Element
  disabled?: boolean
}) => {
  return (
    <Button
      disabled={disabled}
      variant={variant}
      size={size}
      onClick={handleAction}
      className={styles.playButton}
    >
      {icon}
      {action}
    </Button>
  )
}

type ControlPanelProps = Partial<PlaylistContext> & {
  handlePlayPause: () => void
  addAsPlayNext: () => void
  addEpisodeToPlaylist: () => void
  isPlaying: boolean
  disablePlay: boolean
}

export const ControlPanel = ({
  handlePlayPause,
  isPlaying,
  addAsPlayNext,
  addEpisodeToPlaylist,
  disablePlay
}: ControlPanelProps) => {
  return (
    <Flex px="4" width="100%" gap="4" direction="column" align="stretch">
      {createButtons({
        isPlaying,
        handlePlayPause,
        addAsPlayNext,
        addEpisodeToPlaylist,
        disablePlay
      }).map(({ action, icon, variant, handleAction, disabled }) => (
        <BuildButton
          key={action}
          icon={icon}
          handleAction={handleAction}
          action={action}
          disabled={disabled}
          variant={variant as ButtonProps['variant']}
          size={'6' as ButtonProps['size']}
        />
      ))}
    </Flex>
  )
}
