'use client'
import { Flex, Heading, IconButton, Text } from '@radix-ui/themes'
import { EpisodeList } from '../episodes/EpisodeList'
import Image from 'next/image'
import styles from './Series.style.module.scss'
import { LinkOut } from '@/components/Link/LinkOut'
import { truncate } from '@/utils'
import { useSeriesDetails } from './hooks/useSeriesDetails'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { MinusCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { useAddToFavoriteSeries } from '../favoriteSeries/useAddToUserList'
import { Series } from '@/models/Series'

type AddButtonProps = {
  addSeries: (series: Series) => void
  removeSeries: (uuid: string) => void
  isSubscribed: boolean
  series: Series
}

const AddRemoveButton = ({
  addSeries,
  removeSeries,
  series,
  isSubscribed
}: AddButtonProps) => {
  const handleClick = async () => {
    return isSubscribed ? removeSeries(series?.uuid) : addSeries(series)
  }

  return (
    <IconButton
      color="mint"
      variant="ghost"
      onClick={handleClick}
      className={styles.button}
    >
      {isSubscribed ? (
        <MinusCircledIcon width={25} height={25} />
      ) : (
        <PlusCircledIcon width={25} height={25} />
      )}
    </IconButton>
  )
}

export const SeriesDetails = ({
  uuid,
  showImage
}: {
  uuid: string
  showImage?: boolean
}) => {
  const { data, loading, error, loadMore } = useSeriesDetails({ uuid })
  const { addSeries, removeSeries, isSubscribed } = useAddToFavoriteSeries({
    series: data
  })

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
      <Flex align="center" justify="between">
        <Heading as="h2" size="6">
          {data.name}
        </Heading>
        <AddRemoveButton
          addSeries={addSeries}
          removeSeries={removeSeries}
          series={data}
          isSubscribed={isSubscribed}
        />
      </Flex>
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
          <Flex align="start">
            <Text wrap="pretty">{truncate(data.description, 200)}</Text>
          </Flex>
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
