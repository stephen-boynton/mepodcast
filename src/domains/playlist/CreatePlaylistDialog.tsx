import {
  Button,
  Dialog,
  Flex,
  Text,
  TextArea,
  TextField
} from '@radix-ui/themes'
import { useState } from 'react'
import { usePlaylists } from './usePlaylists'

export const CreatePlaylistDialog = () => {
  const { createPlaylist } = usePlaylists()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const createNewPlaylist = () => {
    if (!createPlaylist) return
    createPlaylist({
      name,
      description
    })
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Create Playlist</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Flex direction="column" gap="5">
          <Dialog.Title>Create Playlist</Dialog.Title>
          <Dialog.Description>
            <Text size="3">Create a new playlist to add episodes to.</Text>
          </Dialog.Description>
          <label>
            <Text size="4">Name</Text>
            <TextField.Root
              placeholder="Playlist Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            <Text size="4">Description</Text>
            <TextArea
              placeholder="Playlist Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </Flex>
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close onClick={createNewPlaylist}>
            <Button>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
