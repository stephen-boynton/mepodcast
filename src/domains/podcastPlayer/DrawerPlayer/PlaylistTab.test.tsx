// test the PlaylistTab component

import { render, screen } from '@testing-library/react'
import { PlaylistTab } from './PlaylistTab'
import { playlistMock } from '@/mocks/playlists'

describe('PlaylistTab', () => {
  it('should render', () => {
    render(<PlaylistTab playlists={[]} currentPlaylist={playlistMock} />)
    expect(screen.getByText('Test Playlist')).toBeDefined()
  })
})
