import { PlaylistData } from '@/db/Database'
import { Box, Tabs, Text } from '@radix-ui/themes'

export const PlaylistTab = ({
  playlists,
  currentPlaylist
}: {
  playlists: PlaylistData[]
  currentPlaylist: PlaylistData
}) => {
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
          <Box>
            <Text size="2">{currentPlaylist.name}</Text>
            <Text size="2">{currentPlaylist.episodes.length} episodes</Text>
          </Box>
        </Tabs.Content>

        <Tabs.Content value="other">
          <Text size="2">Other Playlists</Text>
          {playlists.map((playlist) => {
            return (
              <Box key={playlist.id}>
                <Text size="2">{playlist.name}</Text>
                <Text size="2">{playlist.episodes.length} episodes</Text>
              </Box>
            )
          })}
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  )
}
