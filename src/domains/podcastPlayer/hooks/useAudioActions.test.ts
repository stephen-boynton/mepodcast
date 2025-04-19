import { renderHook } from '@testing-library/react'
import { useAudioActions } from './useAudioActions'
import { Episode } from '@/models/Episode'
import { PodcastPlayer } from '@/models/Player'

// Mock the Episode model
jest.mock('@/models/Episode', () => ({
  Episode: jest.fn()
}))

describe('useAudioActions', () => {
  const mockPlayer = {
    isPlaying: false,
    play: jest.fn(),
    pause: jest.fn(),
    saveProgress: jest.fn(),
    complete: jest.fn()
  } as unknown as PodcastPlayer

  const mockEpisode = {} as Episode

  const defaultProps = {
    drawerState: 'closed',
    isInitialized: true,
    minimizeDrawer: jest.fn(),
    openDrawer: jest.fn(),
    player: mockPlayer,
    audioSrc: 'test-audio.mp3'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle play action correctly', () => {
    const { result } = renderHook(() => useAudioActions(defaultProps))

    // Test play when drawer is closed
    result.current.handlePlay(mockEpisode)
    expect(defaultProps.openDrawer).toHaveBeenCalled()
    expect(mockPlayer.play).toHaveBeenCalledWith(mockEpisode)

    // Test play when drawer is already open
    const { result: result2 } = renderHook(() =>
      useAudioActions({ ...defaultProps, drawerState: 'open' })
    )

    result2.current.handlePlay(mockEpisode)
    expect(defaultProps.openDrawer).not.toHaveBeenCalledTimes(2)
    expect(mockPlayer.play).toHaveBeenCalledWith(mockEpisode)
  })

  it('should not play if player is already playing', () => {
    const { result } = renderHook(() =>
      useAudioActions({
        ...defaultProps,
        player: { ...mockPlayer, isPlaying: true } as PodcastPlayer
      })
    )

    result.current.handlePlay(mockEpisode)
    expect(mockPlayer.play).not.toHaveBeenCalled()
  })

  it('should handle listen interval correctly', () => {
    const { result } = renderHook(() => useAudioActions(defaultProps))
    result.current.handleListenInterval()
    expect(mockPlayer.saveProgress).toHaveBeenCalled()
  })

  it('should handle pause action correctly', () => {
    const { result } = renderHook(() => useAudioActions(defaultProps))
    result.current.handlePause()
    expect(mockPlayer.pause).toHaveBeenCalled()
    expect(mockPlayer.saveProgress).toHaveBeenCalled()
  })

  it('should handle completed action correctly', () => {
    const { result } = renderHook(() => useAudioActions(defaultProps))
    result.current.handleCompleted()
    expect(mockPlayer.complete).toHaveBeenCalled()
  })

  it('should handle null player gracefully', () => {
    const { result } = renderHook(() =>
      useAudioActions({ ...defaultProps, player: null })
    )

    // All actions should not throw errors when player is null
    expect(() => result.current.handlePlay(mockEpisode)).not.toThrow()
    expect(() => result.current.handleListenInterval()).not.toThrow()
    expect(() => result.current.handlePause()).not.toThrow()
    expect(() => result.current.handleCompleted()).not.toThrow()
  })
})
