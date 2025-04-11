import { Playlist } from '@/models/Playlist'
import { Button, Dialog } from '@radix-ui/themes'
import { PlaylistList } from './PlaylistList'
import { transformToPlaylistListItem } from './utils'

export const EditPlaylistDialog = ({
  playlist,
  onClose,
  isOpen,
  onSave
}: {
  playlist: Playlist
  onClose: () => void
  isOpen: boolean
  onSave: () => void
}) => {
  const items = playlist.episodes.map(transformToPlaylistListItem)
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>Edit Playlist</Dialog.Title>
        <Dialog.Description>
          Edit the playlist name and description.
        </Dialog.Description>
        <PlaylistList
          items={items}
          currentId={'1'}
          onSwap={() => {}}
          isScrollable={false}
        />
      </Dialog.Content>
      <Dialog.Close onClick={onSave}>
        <Button>Save</Button>
      </Dialog.Close>
    </Dialog.Root>
  )
}
