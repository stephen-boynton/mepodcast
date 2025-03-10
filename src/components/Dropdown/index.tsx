import { DropdownMenu } from 'radix-ui'
import { Separator, Theme } from '@radix-ui/themes'
import styles from './Dropdown.style.module.scss'
import Link from 'next/link'
import { DotsVerticalIcon } from '@radix-ui/react-icons'

export const Dropdown = () => (
  <Theme>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={styles.trigger}>
        <DotsVerticalIcon width={20} height={20} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={5} className={styles.content}>
          <DropdownMenu.Item className={styles.menuItem}>
            <Link href="/">Home</Link>
          </DropdownMenu.Item>
          <Separator color="mint" orientation="horizontal" size="4" />
          <DropdownMenu.Item className={styles.menuItem}>
            <Link href="/me/series">Me Podcasts</Link>
          </DropdownMenu.Item>
          <Separator color="mint" orientation="horizontal" size="4" />
          <DropdownMenu.Item className={styles.menuItem}>
            <Link href="/me/playlists">Me Playlists </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  </Theme>
)
