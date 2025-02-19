import { Episode } from "@/models/Episode";
import { Series } from "@/models/Series";
import { Box, Card, Flex, Text } from "@radix-ui/themes";
import Image from "next/image";

export const PodcastCard = ({
  details,
  renderButton: Button,
}: {
  details: Series | Episode;
  renderButton: React.ComponentType<{ series: Series }>;
}) => {
  return (
    <Box maxWidth="240px" height="100%">
      <Card asChild>
        <Flex gap="3" align="center" height={"100%"}>
          <Box>
            <Flex justify={"between"}>
              {details.imageUrl && (
                <Image
                  src={details.imageUrl}
                  alt={details.name ?? "Podcast Image"}
                  width={100}
                  height={100}
                />
              )}
              <Button series={details as Series} />
            </Flex>
            <Text as="div" size="2" weight="bold">
              {details.name}
            </Text>
            <Text as="div" size="2" color="gray">
              {details.authorName}
            </Text>
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};
