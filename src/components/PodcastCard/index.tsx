import { truncate } from '@/utils'
import { Box, Card, Flex, Inset, Text } from '@radix-ui/themes'
import Image from 'next/image'

export const PodcastCard = ({ details: _details }: { details: string }) => {
  const details = JSON.parse(_details)
  return (
    <Box maxWidth="240px" height="100%">
      <Card asChild size="1">
        <Flex gap="3" align="center" height={'100%'}>
          <Box>
            {details.imageUrl && (
              <Inset clip="padding-box" side="top">
                <Image
                  src={details.imageUrl}
                  alt={details.name ?? 'Podcast Image'}
                  width={160}
                  height={160}
                  objectFit="cover"
                />
              </Inset>
            )}
            <Text as="div" size="2" weight="bold">
              {truncate(details.name, 60)}
            </Text>
            <Text as="div" size="2" color="gray">
              {details.authorName}
            </Text>
          </Box>
        </Flex>
      </Card>
    </Box>
  )
}
