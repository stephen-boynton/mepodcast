import { PlaylistData } from '@/db/Database'
import { AddPlaylistButton } from '@/domains/playlist/AddPlaylistButton'
import { PlaylistList, PlaylistListItem } from '@/domains/playlist/PlaylistList'
import { transformToPlaylistListItem } from '@/domains/playlist/utils'
import { sortByIds } from '@/utils'
import { HeightIcon, PlayIcon } from '@radix-ui/react-icons'
import { Box, Flex, ScrollArea, Switch, Tabs, Text } from '@radix-ui/themes'
import { useEffect, useState } from 'react'
import styles from './PlaylistTab.styles.module.scss'
import { CreatePlaylistDialog } from '@/domains/playlist/CreatePlaylistDialog'
import { usePlaylists } from '@/domains/playlist/usePlaylists'
import { useDrawerPlayer } from '../hooks/useDrawerPlayer'
import { Logger } from '@/lib/Logger'

export const PlaylistTab = ({
  playlists,
  currentPlaylist
}: {
  playlists: PlaylistData[]
  currentPlaylist: PlaylistData
}) => {
  const { addAsCurrentlyPlaying } = usePlaylists()
  const { handlePlay, handlePause, isPlaying } = useDrawerPlayer()
  const [list, setList] = useState<PlaylistListItem[]>(
    currentPlaylist.episodes.map(transformToPlaylistListItem)
  )
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(
    currentPlaylist.getCurrent()?.uuid || null
  )

  const handleItemSelect = (id: string) => {
    const episode = currentPlaylist.episodes.find((ep) => ep.uuid === id)
    if (!episode) {
      Logger.error('No episode found')
      return
    }
    addAsCurrentlyPlaying(episode)
    if (isPlaying) {
      handlePause()
    }
    console.log({ episode })
    handlePlay(episode)
    setSelectedEpisode(id)
    currentPlaylist.save()
    setList(currentPlaylist.episodes.map(transformToPlaylistListItem))
  }
  // Got to rearrange episodes based on the transformed PlaylistListItem
  const handleSwap = (rearranged: PlaylistListItem[]) => {
    const rearrangedEpisodes = sortByIds(
      rearranged.map((ep) => ep.id),
      currentPlaylist.episodes
    )

    setList(rearranged)
    const currentLocation = rearranged.findIndex(
      (ep) => ep.id === selectedEpisode
    )
    currentPlaylist.rewriteList(rearrangedEpisodes)
    currentPlaylist.cursor = currentLocation
    currentPlaylist.save()
  }

  return (
    <Tabs.Root defaultValue="current">
      <Tabs.List>
        <Tabs.Trigger value="current">
          <Text size="4">Currently Playing</Text>
        </Tabs.Trigger>
        <Tabs.Trigger value="other">
          <Text size="4">Other Playlists</Text>
        </Tabs.Trigger>
      </Tabs.List>

      <Box pt="3">
        <Tabs.Content value="current">
          <Flex justify="between" pb="3">
            <Text size="4">{currentPlaylist.name}</Text>
            <Text size="4">
              {currentPlaylist.episodes.length} episode
              {currentPlaylist.episodes.length === 1 ? '' : 's'}
            </Text>
          </Flex>
          <PlaylistList
            currentId={selectedEpisode || ''}
            onSwap={handleSwap}
            isScrollable={true}
            items={list}
            activeIcon={<PlayIcon className={styles.activeIcon} />}
            onItemSelect={handleItemSelect}
          />
        </Tabs.Content>

        <Tabs.Content value="other">
          <Flex
            className={styles.otherPlaylists}
            direction="column"
            pb="3"
            height={'100%'}
          >
            <CreatePlaylistDialog />
            <ScrollArea>
              <PlaylistList
                currentId={'0'}
                onSwap={() => {}}
                isScrollable={true}
                items={playlists.map(transformToPlaylistListItem)}
              />
            </ScrollArea>
          </Flex>
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  )
}
