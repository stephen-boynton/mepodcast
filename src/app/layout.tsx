import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../style/globals.scss'
import { NavBar } from '@/components/NavBar'
import styles from './layout.styles.module.scss'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import BackButton from '@/components/BackButton'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'MePodcast',
  description: 'Avast! Ye Podcast Player!'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {' '}
        <Theme
          accentColor="mint"
          grayColor="gray"
          panelBackground="solid"
          scaling="100%"
          radius="full"
        >
          <NavBar />
          <div className={styles.pageContainer}>
            <BackButton />
            {children}
          </div>
        </Theme>
      </body>
    </html>
  )
}
