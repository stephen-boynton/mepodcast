import { Box, Tabs, Text } from '@radix-ui/themes'

export const PlaylistTab = () => {
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
          <Text size="2">Make changes to your account.</Text>
        </Tabs.Content>

        <Tabs.Content value="other">
          <Text size="2">Access and update your documents.</Text>
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  )
}
