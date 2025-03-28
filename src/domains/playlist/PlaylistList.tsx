import { Episode } from '@/models/Episode'
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

type PlaylistProps = {
  onSwap: (rearranged: Episode[]) => void
  isScrollable: boolean
  episodeList: Episode[]
  selectedEpisode: string
}

export const PlaylistList = ({
  onSwap,
  isScrollable,
  episodeList,
  selectedEpisode
}: PlaylistProps) => {
  return (
    <Box>
      <RadioCards.Root value={selectedEpisode}>
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
            disabled={isScrollable}
            animation={200}
            delay={2}
            swap
            list={episodeList}
            setList={onSwap}
            onStart={(evt: SortableEvent) => {
              evt.item.style.visibility = 'hidden'
            }}
            onEnd={(evt: SortableEvent) => {
              evt.item.style.visibility = 'visible'
            }}
          >
            {episodeList.map((episode) => (
              <RadioCards.Item
                id={episode.uuid}
                className={cn(styles.sortable, {
                  [styles.dragging]: !isScrollable
                })}
                value={episode.uuid}
                draggable={!isScrollable}
                key={episode.uuid}
              >
                <Flex align="center" justify="center">
                  <Flex
                    direction="column"
                    gap="2"
                    align="stretch"
                    justify="center"
                  >
                    <Heading size="2">{episode.authorName}</Heading>
                    <Text size="2">{episode.name}</Text>
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
