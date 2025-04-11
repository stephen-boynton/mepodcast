import {
  Box,
  Card,
  Flex,
  Heading,
  RadioCards,
  ScrollArea,
  Text
} from '@radix-ui/themes'
import styles from './PlaylistList.style.module.scss'
import cn from 'classnames'
import Image from 'next/image'
import { truncate } from '@/utils'

export type PlaylistListItem = {
  heading: string
  id: string
  content: string
  image: string
}

type PlaylistProps = {
  onSwap: (rearranged: PlaylistListItem[]) => void
  isScrollable: boolean
  items: PlaylistListItem[]
  currentId: string
}

export const PlaylistList = ({
  onSwap,
  isScrollable,
  items,
  currentId
}: PlaylistProps) => {
  return (
    <Box>
      <RadioCards.Root value={currentId.toString()}>
        <ul
          className={styles.list}
          style={{
            maxHeight: '30vh',
            height: '30vh'
          }}
        >
          {items.map((item) => (
            <button key={item.id} className={styles.button}>
              <Card
                className={cn(styles.item, {
                  [styles.active]: item.id === `${currentId}`
                })}
              >
                <Flex gap="2">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.heading}
                      width={75}
                      height={75}
                    />
                  )}
                  <Flex direction="column" gap="2" align="stretch">
                    <Heading size="2">{truncate(item.heading, 78)}</Heading>
                    <Text size="2">{item.content}</Text>
                  </Flex>
                </Flex>
              </Card>
            </button>
          ))}
        </ul>
      </RadioCards.Root>
    </Box>
  )
}
