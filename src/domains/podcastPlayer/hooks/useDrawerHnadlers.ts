import { useCallback, useEffect, useState } from 'react'
import { SwipeEventData, useSwipeable } from 'react-swipeable'
import { DrawerState } from './useDrawerPlayer'

const HEIGHTS: Record<DrawerState, number | string> = {
  open: '90vh',
  minimized: 125,
  closed: 0,
  button: 0
}

type UserDrawerHandlerProps = {
  isLoaded?: boolean
  playerInitialized?: boolean
}

export const useDrawerHandlers = ({
  isLoaded,
  playerInitialized
}: UserDrawerHandlerProps) => {
  const [drawerState, setDrawerState] = useState<DrawerState>('closed')
  const [drawerHeight, setHeight] = useState(HEIGHTS.closed)

  const openDrawer = useCallback(() => {
    setHeight(HEIGHTS.open)
    setDrawerState('open')
  }, [])

  const closeDrawer = useCallback(() => {
    setHeight(HEIGHTS.closed)
    setDrawerState('closed')
  }, [])

  const minimizeDrawer = useCallback(() => {
    setHeight(HEIGHTS.minimized)
    setDrawerState('minimized')
  }, [])

  const buttonDrawer = useCallback(() => {
    setHeight(HEIGHTS.button)
    setDrawerState('button')
  }, [])

  const handleSwipeUp = useCallback(() => {
    if (drawerState === 'closed') {
      minimizeDrawer()
    } else {
      openDrawer()
    }
  }, [minimizeDrawer, openDrawer, drawerState])

  const handleSwipeDown = useCallback(() => {
    if (drawerState === 'minimized') {
      if (isLoaded) {
        buttonDrawer()
        return
      }
      closeDrawer()
    } else {
      minimizeDrawer()
    }
  }, [closeDrawer, minimizeDrawer, drawerState, buttonDrawer, isLoaded])

  const swipeHandlers = useSwipeable({
    preventScrollOnSwipe: true,
    onSwiping: (event: SwipeEventData) => {
      if (event.deltaY < 0) {
        handleSwipeUp()
      } else {
        handleSwipeDown()
      }
    }
  })

  useEffect(() => {
    if (playerInitialized) {
      if (isLoaded) {
        buttonDrawer()
      }
    }
  }, [playerInitialized, isLoaded, buttonDrawer])

  return {
    buttonDrawer,
    closeDrawer,
    drawerHeight,
    drawerState,
    setDrawerState,
    handleSwipeDown,
    handleSwipeUp,
    minimizeDrawer,
    openDrawer,
    swipeHandlers
  }
}
