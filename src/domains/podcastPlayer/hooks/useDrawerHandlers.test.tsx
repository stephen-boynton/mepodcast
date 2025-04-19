import {
  renderHook,
  act,
  render,
  waitFor,
  fireEvent,
  screen
} from '@testing-library/react'
import user from '@testing-library/user-event'
import { useDrawerHandlers } from './useDrawerHnadlers'

describe('useDrawerHandlers', () => {
  const defaultProps = {
    isLoaded: false,
    playerInitialized: false
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with closed state', () => {
    const { result } = renderHook(() => useDrawerHandlers(defaultProps))
    expect(result.current.drawerState).toBe('closed')
    expect(result.current.drawerHeight).toBe(0)
  })

  describe('drawer state management', () => {
    it('should open drawer correctly', () => {
      const { result } = renderHook(() => useDrawerHandlers(defaultProps))

      act(() => {
        result.current.openDrawer()
      })

      expect(result.current.drawerState).toBe('open')
      expect(result.current.drawerHeight).toBe('90vh')
    })

    it('should close drawer correctly', () => {
      const { result } = renderHook(() => useDrawerHandlers(defaultProps))

      act(() => {
        result.current.closeDrawer()
      })

      expect(result.current.drawerState).toBe('closed')
      expect(result.current.drawerHeight).toBe(0)
    })

    it('should minimize drawer correctly', () => {
      const { result } = renderHook(() => useDrawerHandlers(defaultProps))

      act(() => {
        result.current.minimizeDrawer()
      })

      expect(result.current.drawerState).toBe('minimized')
      expect(result.current.drawerHeight).toBe(125)
    })

    it('should set button state correctly', () => {
      const { result } = renderHook(() => useDrawerHandlers(defaultProps))

      act(() => {
        result.current.buttonDrawer()
      })

      expect(result.current.drawerState).toBe('button')
      expect(result.current.drawerHeight).toBe(0)
    })
  })

  describe('swipe handlers', () => {
    it('should handle swipe up from closed state', () => {
      const { result } = renderHook(() => useDrawerHandlers(defaultProps))

      act(() => {
        result.current.handleSwipeUp()
      })

      expect(result.current.drawerState).toBe('minimized')
      expect(result.current.drawerHeight).toBe(125)
    })

    it('should handle swipe up from minimized state', () => {
      const { result } = renderHook(() => useDrawerHandlers(defaultProps))

      act(() => {
        result.current.minimizeDrawer()
      })

      expect(result.current.drawerState).toBe('minimized')
      expect(result.current.drawerHeight).toBe(125)

      act(() => {
        result.current.handleSwipeUp()
      })

      expect(result.current.drawerState).toBe('open')
      expect(result.current.drawerHeight).toBe('90vh')
    })

    it('should handle swipe down from minimized state when not loaded', () => {
      const { result } = renderHook(() => useDrawerHandlers(defaultProps))

      act(() => {
        result.current.minimizeDrawer()
      })

      expect(result.current.drawerState).toBe('minimized')
      expect(result.current.drawerHeight).toBe(125)

      act(() => {
        result.current.handleSwipeDown()
      })

      expect(result.current.drawerState).toBe('closed')
      expect(result.current.drawerHeight).toBe(0)
    })

    it('should handle swipe down from minimized state when loaded', () => {
      const { result } = renderHook(() =>
        useDrawerHandlers({ ...defaultProps, isLoaded: true })
      )

      act(() => {
        result.current.minimizeDrawer()
      })

      expect(result.current.drawerState).toBe('minimized')
      expect(result.current.drawerHeight).toBe(125)

      act(() => {
        result.current.handleSwipeDown()
      })

      expect(result.current.drawerState).toBe('button')
      expect(result.current.drawerHeight).toBe(0)
    })

    it('should handle swipe down from open state', () => {
      const { result } = renderHook(() => useDrawerHandlers(defaultProps))

      act(() => {
        result.current.openDrawer()
        result.current.handleSwipeDown()
      })

      expect(result.current.drawerState).toBe('minimized')
      expect(result.current.drawerHeight).toBe(125)
    })
  })

  describe('initialization effect', () => {
    it('should set button state when player is initialized and loaded', () => {
      const { result } = renderHook(() =>
        useDrawerHandlers({ isLoaded: true, playerInitialized: true })
      )

      expect(result.current.drawerState).toBe('button')
      expect(result.current.drawerHeight).toBe(0)
    })

    it('should not change state when player is initialized but not loaded', () => {
      const { result } = renderHook(() =>
        useDrawerHandlers({ isLoaded: false, playerInitialized: true })
      )

      expect(result.current.drawerState).toBe('closed')
      expect(result.current.drawerHeight).toBe(0)
    })

    it('should not change state when player is not initialized', () => {
      const { result } = renderHook(() =>
        useDrawerHandlers({ isLoaded: true, playerInitialized: false })
      )

      expect(result.current.drawerState).toBe('closed')
      expect(result.current.drawerHeight).toBe(0)
    })
  })

  it('should trigger swipe up to minimized when swipe up event is detected', async () => {
    const { result } = renderHook(() => useDrawerHandlers(defaultProps))
    render(
      <div
        data-testid="swipe-container"
        style={{ width: 100, height: 100 }}
        {...result.current.swipeHandlers}
      />
    )

    fireEvent.touchStart(screen.getByTestId('swipe-container'), {
      touches: [{ clientX: 0, clientY: 0 }]
    })
    fireEvent.touchMove(screen.getByTestId('swipe-container'), {
      touches: [{ clientX: 0, clientY: -100 }]
    })
    fireEvent.touchEnd(screen.getByTestId('swipe-container'))
    expect(result.current.drawerState).toBe('minimized')
  })

  it('should trigger swipe up to open when swipe up event is detected', async () => {
    const { result } = renderHook(() => useDrawerHandlers(defaultProps))

    render(
      <div
        data-testid="swipe-container"
        style={{ width: 100, height: 100 }}
        {...result.current.swipeHandlers}
      />
    )

    act(() => {
      result.current.setDrawerState('minimized')
    })

    fireEvent.touchStart(screen.getByTestId('swipe-container'), {
      touches: [{ clientX: 0, clientY: 0 }]
    })
    fireEvent.touchMove(screen.getByTestId('swipe-container'), {
      touches: [{ clientX: 0, clientY: -100 }]
    })
    fireEvent.touchEnd(screen.getByTestId('swipe-container'))
    expect(result.current.drawerState).toBe('open')
  })

  it('should trigger swipe down when swipe down event is detected', async () => {
    const { result } = renderHook(() => useDrawerHandlers(defaultProps))
    render(
      <div
        data-testid="swipe-container"
        style={{ width: 100, height: 100 }}
        {...result.current.swipeHandlers}
      />
    )

    act(() => {
      result.current.setDrawerState('minimized')
    })

    fireEvent.touchStart(screen.getByTestId('swipe-container'), {
      touches: [{ deltaY: 0 }]
    })
    fireEvent.touchMove(screen.getByTestId('swipe-container'), {
      touches: [{ deltaY: 100 }]
    })
    fireEvent.touchEnd(screen.getByTestId('swipe-container'))
    expect(result.current.drawerState).toBe('closed')
  })

  it('should trigger swipe down to minimized when swipe down event is detected', async () => {
    const { result } = renderHook(() => useDrawerHandlers(defaultProps))

    render(
      <div
        data-testid="swipe-container"
        style={{
          width: 100,
          height: 100
        }}
        {...result.current.swipeHandlers}
      />
    )

    act(() => {
      result.current.setDrawerState('open')
    })

    fireEvent.touchStart(screen.getByTestId('swipe-container'), {
      touches: [{ clientX: 0, clientY: 0 }]
    })
    fireEvent.touchMove(screen.getByTestId('swipe-container'), {
      touches: [{ clientX: 0, clientY: 100 }]
    })
    fireEvent.touchEnd(screen.getByTestId('swipe-container'))
    expect(result.current.drawerState).toBe('minimized')
  })

  it('should provide swipe handlers', () => {
    const { result } = renderHook(() => useDrawerHandlers(defaultProps))

    expect(result.current.swipeHandlers).toBeDefined()
    expect(typeof result.current.swipeHandlers.ref).toBeDefined()
  })
})
