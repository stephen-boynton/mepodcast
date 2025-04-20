import { PlaylistList, PlaylistListItem } from '@/domains/playlist/PlaylistList'
import { transformToPlaylistListItem } from '@/domains/playlist/utils'
import { sortByIds } from '@/utils'
import { PlayIcon } from '@radix-ui/react-icons'
import { Box, Flex, ScrollArea, Tabs, Text } from '@radix-ui/themes'
import { useState } from 'react'
import styles from './PlaylistTab.styles.module.scss'
import { CreatePlaylistDialog } from '@/domains/playlist/CreatePlaylistDialog'
import { usePlaylists } from '@/domains/playlist/usePlaylists'
import { useDrawerPlayer } from '../hooks/useDrawerPlayer'
import { Logger } from '@/lib/Logger'
import { Playlist } from '@/models/Playlist'
import { PlaylistService } from '@/services/PlaylistService'
import { Episode } from '@/models/Episode'

export const PlaylistTab = ({
  playlists,
  currentPlaylist
}: {
  playlists: Playlist[]
  currentPlaylist: Playlist
}) => {
  const { handlePlay, handlePause, isPlaying } = useDrawerPlayer()
  const [list, setList] = useState<PlaylistListItem[]>(
    currentPlaylist.episodes?.map(transformToPlaylistListItem)
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

    currentPlaylist.addAsCurrentlyPlaying(episode)

    if (isPlaying) {
      handlePause()
    }

    if (!currentPlaylist.id) {
      Logger.error('No current playlist id')
      return
    }

    handlePlay(episode)
    setSelectedEpisode(id)
    PlaylistService.updatePlaylist(currentPlaylist)
    setList(currentPlaylist.episodes.map(transformToPlaylistListItem))
  }

  // Got to rearrange episodes based on the transformed PlaylistListItem
  const handleSwap = (rearranged: PlaylistListItem[]) => {
    if (!currentPlaylist.episodes?.length) {
      Logger.error('No current playlist with episodes')
      return
    }

    const rearrangedEpisodes = sortByIds(
      rearranged.map((ep) => ep.id),
      currentPlaylist.episodes.map((ep) => ({
        ...ep,
        id: ep.uuid
      })) as (Episode & { id: string })[]
    )

    setList(rearranged)
    const currentLocation = rearranged.findIndex(
      (ep) => ep.id === selectedEpisode
    )
    currentPlaylist.rewriteList(rearrangedEpisodes)
    currentPlaylist.cursor = currentLocation
    PlaylistService.updatePlaylist(currentPlaylist)
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
                onItemSelect={() => {}}
              />
            </ScrollArea>
          </Flex>
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  )
}
