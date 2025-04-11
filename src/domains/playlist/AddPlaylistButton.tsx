'use client'
import { Button } from '@radix-ui/themes'
import { usePlaylists } from './usePlaylists'

export const AddPlaylistButton = () => {
  const { createPlaylist } = usePlaylists()
  const handleCreatePlaylist = () => {
    if (!createPlaylist) return
    createPlaylist({
      name: 'New Playlist',
      description: 'Description'
    })
  }
  return <Button onClick={handleCreatePlaylist}>Add New Playlist</Button>
}
