'use client'
import { DownloadIcon } from '@radix-ui/react-icons'
import { IconButton } from '@radix-ui/themes'
import styles from './DownloadButton.style.module.scss'

export const DownloadButton = () => {
  return (
    <IconButton className={styles.button} onClick={() => {}}>
      <DownloadIcon width={25} height={25} />
    </IconButton>
  )
}
