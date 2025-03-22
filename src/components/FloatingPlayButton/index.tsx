'use client'
import { useState } from 'react'
import styles from './FloatingPlayButton.style.module.scss'
import cn from 'classnames'
import { SwipeEventData, useSwipeable } from 'react-swipeable'

const SWIPE_THRESHOLD = 20 // Minimum movement needed to register a swipe
const DOMINANT_AXIS_RATIO = 1.5 // Ensure the dominant direction is strong enough

const FloatingPlayButton = ({
  onClick,
  onSwipeUp,
  isPlaying
}: {
  onClick?: () => void
  isPlaying: boolean
}) => {
  const [isHiding, setIsHiding] = useState(false)
  console.log({ isPlaying })
  const handleSwiping = ({ deltaX, deltaY }: SwipeEventData) => {
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX > SWIPE_THRESHOLD || absY > SWIPE_THRESHOLD) {
      if (absX > absY * DOMINANT_AXIS_RATIO) {
        if (deltaX < 0) {
          setIsHiding(false)
        } else {
          setIsHiding(true)
        }
      } else if (absY > absX * DOMINANT_AXIS_RATIO) {
        if (deltaY < 0) {
          onSwipeUp()
        }
      }
    }
  }

  const swipeHandlers = useSwipeable({
    preventScrollOnSwipe: true,
    swipeDuration: 500,
    onSwiping: handleSwiping
  })

  return (
    <div {...swipeHandlers} className={styles.wrapper}>
      <button
        className={cn(styles.container, {
          [styles.pulse]: isPlaying,
          [styles.slideRight]: isHiding,
          [styles.slideLeft]: !isHiding
        })}
        onClick={onClick}
      >
        {isPlaying ? '❚❚' : '▶'}
      </button>
    </div>
  )
}

export default FloatingPlayButton
