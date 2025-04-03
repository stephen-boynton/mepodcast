import { PlaylistData } from '@/db/Database'
import { PlaylistList, PlaylistListItem } from '@/domains/playlist/PlaylistList'
import { transformToPlaylistListItem } from '@/domains/playlist/utils'
import { sortByIds } from '@/utils'
import { HeightIcon } from '@radix-ui/react-icons'
import { Box, Flex, Switch, Tabs, Text } from '@radix-ui/themes'
import { useEffect, useState } from 'react'

export const PlaylistTab = ({
  playlists,
  currentPlaylist
}: {
  playlists: PlaylistData[]
  currentPlaylist: PlaylistData
}) => {
  const [list, setList] = useState<PlaylistListItem[]>(
    currentPlaylist.episodes.map(transformToPlaylistListItem)
  )
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null)
  const [isScrollable, setIsScrollable] = useState(true)

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

  useEffect(() => {
    setSelectedEpisode(currentPlaylist.getCurrent()?.uuid || null)
  }, [currentPlaylist])
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
          <Flex gap="3" p="3" align="center">
            <HeightIcon width={32} height={32} />
            <Switch onCheckedChange={() => setIsScrollable((prev) => !prev)} />
          </Flex>
          <PlaylistList
            currentId={currentPlaylist.cursor}
            onSwap={handleSwap}
            isScrollable={isScrollable}
            items={list}
          />
        </Tabs.Content>

        <Tabs.Content value="other">
          <Text size="2">Other Playlists</Text>
          {playlists.map((episode) => {
            return (
              <Box key={episode.id}>
                <Text size="2">{episode.name}</Text>
              </Box>
            )
          })}
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  )
}
