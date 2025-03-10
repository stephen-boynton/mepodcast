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

const createButtons = ({ isPlaying }: { isPlaying: boolean }) => [
  {
    action: isPlaying ? 'Pause' : 'Play',
    variant: 'primary',
    icon: isPlaying ? (
      <PauseIcon name="pause" width={25} height={25} />
    ) : (
      <PlayIcon name="play" width={25} height={25} />
    )
  },
  {
    action: 'Play Next',
    variant: 'outline',
    icon: <CardStackPlusIcon name="pause" width={25} height={25} />
  },
  {
    action: 'Playlist',
    variant: 'outline',
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
  action
}: ButtonProps & {
  handleAction: () => void
  action: string
  icon: JSX.Element
}) => {
  return (
    <Button
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

export const ControlPanel = ({
  handleAction,
  isPlaying
}: {
  handleAction: () => void
  isPlaying: boolean
}) => {
  const Icon = () =>
    !isPlaying ? (
      <PlayIcon
        name="play"
        width={25}
        height={25}
        className={styles.playIcon}
      />
    ) : (
      <PauseIcon
        name="pause"
        width={25}
        height={25}
        className={styles.playIcon}
      />
    )
  return (
    <Flex px="4" width="100%" gap="4" direction="column" align="stretch">
      {createButtons({ isPlaying }).map(({ action, icon, variant }) => (
        <BuildButton
          key={action}
          icon={icon}
          handleAction={handleAction}
          action={action}
          variant={variant as ButtonProps['variant']}
          size={'6' as ButtonProps['size']}
        />
      ))}
    </Flex>
  )
}
