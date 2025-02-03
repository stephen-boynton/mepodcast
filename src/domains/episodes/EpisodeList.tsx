import { SeriesEpisodes } from "./types";
import styles from "./EpisodeList.style.module.scss";
import { Avatar, Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";
import { truncate } from "@/utils";
import { SeriesDetail } from "../series/types";

export const ListCard = ({
  data,
  imgSrc,
}: {
  data: SeriesEpisodes | SeriesDetail;
  imgSrc: string;
}) => {
  return (
    <li>
      <div className={styles.itemContainer}>
        <Text size="1" weight="bold">
          {data.name}
        </Text>
        <div className={styles.itemText}>
          <Image
            src={imgSrc}
            alt={data.name}
            objectFit="cover"
            width={100}
            height={100}
          />
          <Text size="1">{truncate(data.description, 50)}</Text>
        </div>
      </div>
    </li>
  );
};

export const EpisodeList = ({
  episodes,
  imgSrc,
}: {
  episodes: SeriesEpisodes[];
  imgSrc: string;
}) => {
  return (
    <div>
      <Heading as="h3" mb="4" weight="bold">
        Episodes:
      </Heading>
      <ul className={styles.container}>
        {episodes.map((episode) => {
          return <ListCard key={episode.uuid} data={episode} imgSrc={imgSrc} />;
        })}
      </ul>
    </div>
  );
};
