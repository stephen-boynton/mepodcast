import {
  Box,
  Flex,
  Heading,
  RadioCards,
  ScrollArea,
  Text
} from '@radix-ui/themes'
import { ReactSortable, SortableEvent } from 'react-sortablejs'
import styles from './PlaylistList.style.module.scss'
import cn from 'classnames'

export type PlaylistListItem = {
  heading: string
  id: string
  content: string
}

type PlaylistProps = {
  onSwap: (rearranged: PlaylistListItem[]) => void
  isScrollable: boolean
  items: PlaylistListItem[]
  currentId: number
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
        <ScrollArea
          type="always"
          scrollbars="vertical"
          className={styles.descriptionBox}
          style={{
            maxHeight: '30vh',
            height: '30vh'
          }}
        >
          <ReactSortable
            group="groupName"
            className={styles.sortableContainer}
            disabled={isScrollable}
            animation={200}
            delay={2}
            swap
            list={items}
            setList={onSwap}
            onStart={(evt: SortableEvent) => {
              evt.item.style.visibility = 'hidden'
            }}
            onEnd={(evt: SortableEvent) => {
              evt.item.style.visibility = 'visible'
            }}
          >
            {items.map((item) => (
              <RadioCards.Item
                id={item.id}
                className={cn(styles.sortable, {
                  [styles.dragging]: !isScrollable
                })}
                value={item.id}
                draggable={!isScrollable}
                key={item.id}
              >
                <Flex align="center" justify="center">
                  <Flex
                    direction="column"
                    gap="2"
                    align="stretch"
                    justify="center"
                  >
                    <Heading size="2">{item.heading}</Heading>
                    <Text size="2">{item.content}</Text>
                  </Flex>
                </Flex>
              </RadioCards.Item>
            ))}
          </ReactSortable>
        </ScrollArea>
      </RadioCards.Root>
    </Box>
  )
}
