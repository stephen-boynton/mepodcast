'use client'
import { Flex, Heading, Text } from '@radix-ui/themes'
import { EpisodeList } from '../episodes/EpisodeList'
import Image from 'next/image'
import styles from './Series.style.module.scss'
import { LinkOut } from '@/components/Link/LinkOut'
import { truncate } from '@/utils'
import { useSeriesDetails } from './hooks/useSeriesDetails'
import useInfiniteScroll from 'react-infinite-scroll-hook'

export const SeriesDetails = ({
  uuid,
  showImage
}: {
  uuid: string
  showImage?: boolean
}) => {
  const { data, loading, error, loadMore } = useSeriesDetails({ uuid })

  const [sentryRef] = useInfiniteScroll({
    onLoadMore: loadMore,
    hasNextPage: true,
    loading
  })

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <Flex className={styles.container}>
      <Heading as="h2" size="6">
        {data.name}
      </Heading>
      <Flex direction="column" className={styles.description}>
        {showImage && (
          <Image
            src={data.imageUrl}
            alt={data.name}
            objectFit="cover"
            width={100}
            height={100}
          />
        )}
        <Flex direction="column" className={styles.descriptionText}>
          <Text wrap="pretty">{truncate(data.description, 200)}</Text>
          <LinkOut href={data.websiteUrl || ''}>More details.</LinkOut>
        </Flex>
      </Flex>
      <EpisodeList
        sentryRef={sentryRef}
        key={data.uuid}
        progress={data.progress}
        seriesId={data.uuid}
        episodes={data.episodes}
        imgSrc={data.imageUrl}
        loading={loading}
        hasMorePages={true}
      />
    </Flex>
  )
}
