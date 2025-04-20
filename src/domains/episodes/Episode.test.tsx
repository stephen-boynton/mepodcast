// test the episode UI

import { fireEvent, render, screen } from '@testing-library/react'
import { EpisodeDetail } from './Episode'

import { convertFromUnix, clean, removeHtml } from '@/utils'
import { useDrawerPlayer } from '../podcastPlayer/hooks/useDrawerPlayer'
import { episodeMock, episodeMockBuilder } from '@/mocks/episodes'
import { usePlaylists } from '../playlist/usePlaylists'

jest.mock('../podcastPlayer/hooks/useDrawerPlayer')

jest.mock('@/domains/playlist/usePlaylists')

jest.mock('./useEpisodeDetails', () => ({
  useEpisodeDetail: () => ({
    data: episodeMock
  })
}))

jest.mock('next/navigation', () => ({
  useParams: () => ({
    id: '1'
  })
}))

describe('Episode', () => {
  const mockHandlePlay = jest.fn()
  const mockAddAsCurrentlyPlaying = jest.fn()
  const mockAddAsPlayNext = jest.fn()
  beforeEach(() => {
    jest.restoreAllMocks()
    ;(useDrawerPlayer as jest.Mock).mockReturnValue({
      handlePlay: mockHandlePlay,
      audioSrc: 'test.mp3'
    })
    ;(usePlaylists as jest.Mock).mockReturnValue({
      addAsCurrentlyPlaying: mockAddAsCurrentlyPlaying,
      addAsPlayNext: mockAddAsPlayNext
    })
  })

  it('should render', () => {
    render(<EpisodeDetail />)
    expect(screen.getByText(episodeMock.name!)).toBeInTheDocument()
  })

  it('should render the episode details', () => {
    render(<EpisodeDetail />)
    expect(
      screen.getByAltText(`${episodeMock.name} Show Image`)
    ).toBeInTheDocument()

    expect(screen.getByTestId('show-website')).toHaveAttribute(
      'href',
      episodeMock.websiteUrl
    )

    expect(
      screen.getByText(
        `Season ${episodeMock.seasonNumber} Episode ${episodeMock.episodeNumber}`
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(convertFromUnix(episodeMock.datePublished))
    ).toBeInTheDocument()

    expect(
      screen.getByText(removeHtml(episodeMock.description).slice(0, 100), {
        exact: false
      })
    ).toBeInTheDocument()
  })

  it('should render the control panel', () => {
    render(<EpisodeDetail />)
    expect(screen.getByText('Play')).toBeInTheDocument()
    expect(screen.getByText('Playlist')).toBeInTheDocument()
    expect(screen.getByText('Play Next')).toBeInTheDocument()
    expect(screen.getByText('Download')).toBeInTheDocument()
  })

  it('should control the play behavior', async () => {
    render(<EpisodeDetail />)
    const playButton = screen.getByText('Play')
    await fireEvent.click(playButton)
    expect(mockHandlePlay).toHaveBeenCalled()
    expect(mockAddAsCurrentlyPlaying).toHaveBeenCalled()
  })

  it('should add the episode to the playlist', async () => {
    render(<EpisodeDetail />)
    const playButton = screen.getByText('Play Next')
    await fireEvent.click(playButton)
    expect(mockAddAsPlayNext).toHaveBeenCalled()
  })
})
