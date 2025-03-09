import { DropdownMenu } from 'radix-ui'
import { Separator, Theme } from '@radix-ui/themes'
import styles from './Dropdown.style.module.scss'
import Link from 'next/link'

export const Dropdown = () => (
  <Theme>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={styles.trigger}>Me</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={5} className={styles.content}>
          <DropdownMenu.Item className={styles.menuItem}>
            <Link href="/me/series">Podcasts</Link>
          </DropdownMenu.Item>
          <Separator orientation="horizontal" size="4" />
          <DropdownMenu.Item className={styles.menuItem}>
            <Link href="/me/playlists"> Playlists </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  </Theme>
)
