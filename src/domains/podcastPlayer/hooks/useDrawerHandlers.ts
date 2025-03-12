import { useCallback, useState } from 'react'
import { SwipeEventData, useSwipeable } from 'react-swipeable'
import { DrawerState } from './useDrawerPlayer'

const HEIGHTS: Record<DrawerState, number | string> = {
  open: '90vh',
  minimized: 125,
  closed: 0
}

export const useDrawerHandlers = () => {
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

  const handleSwipeUp = useCallback(() => {
    if (drawerState === 'closed') {
      minimizeDrawer()
    } else {
      openDrawer()
    }
  }, [minimizeDrawer, openDrawer, drawerState])

  const handleSwipeDown = useCallback(() => {
    if (drawerState === 'minimized') {
      closeDrawer()
    } else {
      minimizeDrawer()
    }
  }, [closeDrawer, minimizeDrawer, drawerState])

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
  return {
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
