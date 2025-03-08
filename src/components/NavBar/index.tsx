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
        <Heading as="h1">MePodcast</Heading>
      </Flex>
      <Flex className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/search">Search</Link>
        <Dropdown />
      </Flex>
    </Flex>
  )
}
