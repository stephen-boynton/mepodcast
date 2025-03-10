import { PodcastCard } from '@/components/PodcastCard'
import { Flex, Heading, Separator } from '@radix-ui/themes'
import { Content, DisplayType } from '@/types/shared'
import { useTopTen as fetchTopTen } from './useTopTen'
import styles from './TopTen.style.module.scss'
import Link from 'next/link'

const TopGrid = ({ items }: { items: Content[]; type: DisplayType }) => {
  return (
    <ul className={styles.itemGrid}>
      {items.map((item) => {
        const details = JSON.stringify(item)
        return (
          <li key={item.uuid} className={styles.itemContainer}>
            <Link href={`/series/${item.uuid}`}>
              <PodcastCard details={details} />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export const TopTen = async () => {
  const {
    data: { series, episodes }
  } = await fetchTopTen()
  return (
    <Flex direction="column" justify="center">
      <Heading as="h3" mb="4" weight="bold">
        Top 10 Series
      </Heading>
      <TopGrid items={series} type="series" />

      {episodes.length && (
        <>
          <Separator my="8" size="4" />
          <Heading as="h3" mb="4" weight="bold">
            Top 10 Episodes
          </Heading>
          <TopGrid items={episodes} type="episode" />
        </>
      )}
    </Flex>
  )
}
