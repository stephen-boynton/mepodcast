import { useState } from 'react'
import ReactSimplyCarousel from 'react-simply-carousel'

export function Carousel({ children }: React.PropsWithChildren) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  return (
    <div>
      <ReactSimplyCarousel
        activeSlideIndex={activeSlideIndex}
        onRequestChange={setActiveSlideIndex}
      >
        {children}
      </ReactSimplyCarousel>
    </div>
  )
}
