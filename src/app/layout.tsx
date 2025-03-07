import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../style/globals.scss'
import { NavBar } from '@/components/NavBar'
import styles from './layout.styles.module.scss'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import { DrawerPlayer } from '@/domains/podcastPlayer/DrawerPlayer'
import { SelectedEpisodeProvider } from '@/domains/podcastPlayer/SelectedEpisodeContext'
import { DrawerStateProvider } from '@/domains/podcastPlayer/DrawerPlayer/useDrawerPlayer'
import { ApolloWrapper } from '@/lib/gql/makeClient'

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
          appearance="dark"
          accentColor="mint"
          grayColor="gray"
          panelBackground="solid"
          scaling="100%"
          radius="full"
        >
          <NavBar />
          <ApolloWrapper>
            <SelectedEpisodeProvider>
              <DrawerStateProvider>
                <div className={styles.pageContainer}>
                  {children}
                  <DrawerPlayer />
                </div>
              </DrawerStateProvider>
            </SelectedEpisodeProvider>
          </ApolloWrapper>
        </Theme>
      </body>
    </html>
  )
}
