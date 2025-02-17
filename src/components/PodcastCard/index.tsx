import { Box, Card, Flex, Text } from "@radix-ui/themes";
import Image from "next/image";

type PodcastCardProps = {
  imgSrc: string;
  name: string;
  author: string;
};

export const PodcastCard = ({ imgSrc, name, author }: PodcastCardProps) => {
  return (
    <Box maxWidth="240px">
      <Card>
        <Flex gap="3" align="center">
          <Box>
            {imgSrc && (
              <Image src={imgSrc} alt={name} width={100} height={100} />
            )}
            <Text as="div" size="2" weight="bold">
              {name}
            </Text>
            <Text as="div" size="2" color="gray">
              {author}
            </Text>
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};
