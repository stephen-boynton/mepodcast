import styles from './ListCard.styles.module.scss'
import { Badge, Box, Card, Heading, Text } from '@radix-ui/themes'
import { convertFromUnix } from '@/utils'
import Link from 'next/link'
import { Progress } from '@/models/Progress'
import { Maybe } from '@/types/shared'

export const ListCard = ({
  href,
  name,
  inProgress,
  episodeNumber,
  episodeDatePublished
}: {
  href: string
  name: Maybe<string>
  inProgress?: Progress
  description: Maybe<string>
  episodeNumber: Maybe<number>
  episodeDatePublished: Maybe<number>
}) => {
  return (
    <Link href={href}>
      <Card asChild className={styles.itemContainer}>
        <Box className={styles.itemText}>
          {inProgress && (
            <Badge size="2" color="orange" className={styles.inProgress}>
              In Progress{' '}
            </Badge>
          )}
          <Box p="1">
            <Heading size="3" weight="bold">
              {name}
            </Heading>
            <Text mr="2" size="2" className={styles.description}>
              Episode {episodeNumber}
            </Text>
            <Text size="2" className={styles.description}>
              {episodeDatePublished && convertFromUnix(episodeDatePublished)}
            </Text>
          </Box>
        </Box>
      </Card>
    </Link>
  )
}
