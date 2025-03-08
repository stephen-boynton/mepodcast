import styles from './ListCard.styles.module.scss'
import { Badge, Card, Flex, Text } from '@radix-ui/themes'
import Image from 'next/image'
import { clean, truncate } from '@/utils'
import Link from 'next/link'
import { Progress } from '@/models/Progress'
import { Maybe } from '@/types/shared'

export const ListCard = ({
  href,
  name,
  inProgress,
  description,
  imgSrc,
  showDescription
}: {
  href: string
  name: Maybe<string>
  inProgress?: Progress
  description: Maybe<string>
  imgSrc: string
  showDescription?: boolean
}) => {
  return (
    <Link href={href}>
      <Card size="3" className={styles.itemContainer}>
        {/* {inProgress && <CircleIcon className={styles.inProgress} />} */}
        {inProgress && (
          <Badge size="2" color="orange" className={styles.inProgress}>
            In Progress{' '}
          </Badge>
        )}
        <Flex className={styles.itemText}>
          <Image
            src={imgSrc}
            alt={name ?? 'Podcast Image'}
            objectFit="cover"
            width={100}
            height={100}
          />
          <Flex gap="2" align="center" direction="column">
            <Text size="3" weight="bold">
              {name}
            </Text>
            {showDescription && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{
                  __html: truncate(clean(description ?? ''), 175)
                }}
              />
            )}
          </Flex>
        </Flex>
      </Card>
    </Link>
  )
}
