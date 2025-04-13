import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { DrawerPlayer } from './'
import { useDrawerPlayer } from '../hooks/useDrawerPlayer'
import { usePlaylists } from '@/domains/playlist/usePlaylists'
import { Episode } from '@/models/Episode'

jest.mock('../hooks/useDrawerPlayer')
jest.mock('@/domains/playlist/usePlaylists', () => ({
  usePlaylists: jest.fn()
}))

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () =>
    function MockDrawer({ children }: { children: React.ReactNode }) {
      return <div data-testid="mock-drawer">{children}</div>
    }
}))

describe('DrawerPlayer', () => {
  const mockEpisode: Partial<Episode> = {
    name: 'Test Episode',
    audioUrl: 'https://example.com/audio.mp3',
    imageUrl: 'https://example.com/image.jpg'
  }

  const mockPlaylist = {
    getCurrent: () => mockEpisode,
    episodes: [mockEpisode],
    name: 'Test Playlist'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useDrawerPlayer as jest.Mock).mockReturnValue({
      drawerHeight: 100,
      drawerState: 'open',
      drawerRef: jest.fn(),
      handleCompleted: jest.fn(),
      handleListenInterval: jest.fn(),
      handlePause: jest.fn(),
      handlePlay: jest.fn(),
      initializePlayer: jest.fn(),
      player: {
        initialize: jest.fn()
      },
      isInitialized: true,
      swipeHandlers: {}
    })
    ;(usePlaylists as jest.Mock).mockReturnValue({
      playlists: [mockPlaylist],
      selectedPlaylist: mockPlaylist
    })
  })

  it('should render the drawer with correct initial state', () => {
    render(<DrawerPlayer />)

    expect(screen.getByTestId('mock-drawer')).toBeInTheDocument()

    expect(screen.getAllByText('Test Episode')).toHaveLength(2)

    const image = screen.getByAltText('Test Episode')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src')
  })

  it('should render minimized state correctly', () => {
    ;(useDrawerPlayer as jest.Mock).mockReturnValue({
      ...useDrawerPlayer(),
      drawerState: 'minimized'
    })

    render(<DrawerPlayer />)

    expect(screen.getByTestId('mock-drawer')).toBeInTheDocument()

    expect(screen.queryByText('Test Episode')).not.toBeInTheDocument()
  })

  it('should initialize player when episode changes', () => {
    const mockInitialize = jest.fn()
    ;(useDrawerPlayer as jest.Mock).mockReturnValue({
      ...useDrawerPlayer(),
      player: {
        initialize: mockInitialize
      }
    })

    render(<DrawerPlayer />)

    expect(mockInitialize).toHaveBeenCalledWith(mockEpisode)
  })

  it('should render PlaylistTab when drawer is open', () => {
    render(<DrawerPlayer />)

    expect(screen.getByText('Test Playlist')).toBeInTheDocument()
  })

  it('should not render PlaylistTab when drawer is minimized', () => {
    ;(useDrawerPlayer as jest.Mock).mockReturnValue({
      ...useDrawerPlayer(),
      drawerState: 'minimized'
    })

    render(<DrawerPlayer />)

    expect(screen.queryByText('Test Playlist')).not.toBeInTheDocument()
  })
})
