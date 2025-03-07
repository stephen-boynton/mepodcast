import Link from 'next/link'
import React from 'react'
import styles from './styles.module.scss'
import { Dropdown } from '../Dropdown'
import BackButton from '../BackButton'

export const NavBar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <BackButton />
        <h1 className={styles.logo}>MePodcast</h1>
      </div>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/search">Search</Link>
        <Dropdown />
      </nav>
    </div>
  )
}
