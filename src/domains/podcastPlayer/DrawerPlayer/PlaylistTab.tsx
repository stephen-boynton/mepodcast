import { PlaylistData } from '@/db/Database'
import { PlaylistList } from '@/domains/playlist/PlaylistList'
import { Episode } from '@/models/Episode'
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
  const [list, setList] = useState<Episode[]>(currentPlaylist.episodes)
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null)
  const [isScrollable, setIsScrollable] = useState(true)

  const handleSwap = (rearranged: Episode[]) => {
    setList(rearranged)
    const currentLocation = rearranged.findIndex(
      (ep) => ep.uuid === selectedEpisode
    )
    currentPlaylist.rewriteList(rearranged)
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
            selectedEpisode={currentPlaylist.cursor}
            onSwap={handleSwap}
            isScrollable={isScrollable}
            episodeList={list}
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
