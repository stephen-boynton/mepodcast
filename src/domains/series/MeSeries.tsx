'use client'
import { Card, Flex, Text } from '@radix-ui/themes'
import { useSubscribedSeries } from './hooks/useSubscribedSeries'
import Link from 'next/link'
import Image from 'next/image'
import { Series } from '@/models/Series'
import styles from './MeSeries.style.module.scss'
import { sortBy } from 'es-toolkit'

const ListItem = ({ series }: { series: Series }) => {
  return (
    <li className={styles.li}>
      <Card className={styles.item} asChild size="1">
        <Flex gap="2" align="center" justify="start">
          <Image
            src={series.imageUrl}
            alt={series.name}
            width={80}
            height={80}
            objectFit="cover"
          />
          <Flex direction="column">
            <Text size="4" weight="bold">
              {series.name}
            </Text>
            <Text size="4">{series.authorName}</Text>
          </Flex>
        </Flex>
      </Card>
    </li>
  )
}

export const MeSeries = () => {
  const { subscribed } = useSubscribedSeries()
  const sorted = subscribed && sortBy(subscribed, ['name'])
  return (
    <Flex gap="2" direction="column" className={styles.container}>
      {sorted?.map((series) => (
        <Link key={series.id} href={`/series/${series.uuid}`}>
          <ListItem series={series} />
        </Link>
      ))}
    </Flex>
  )
}
