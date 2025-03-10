import Link from 'next/link'
import React from 'react'
import styles from './styles.module.scss'
import { Dropdown } from '../Dropdown'
import BackButton from '../BackButton'
import { Flex, Heading } from '@radix-ui/themes'

export const NavBar = () => {
  return (
    <Flex align="center" justify="between" className={styles.container}>
      <Flex align="center" justify="between">
        <BackButton />
        <Link href="/">
          <Heading as="h1">MePodcast</Heading>
        </Link>
      </Flex>
      <Flex className={styles.nav}>
        <Dropdown />
      </Flex>
    </Flex>
  )
}
