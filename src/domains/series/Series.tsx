import { Heading, Text } from "@radix-ui/themes";
import { mockSeries } from "./mocks";
import { EpisodeList } from "../episodes/EpisodeList";
import Image from "next/image";
import styles from "./Series.style.module.scss";
import { LinkOut } from "@/components/Link/LinkOut";
import { truncate } from "@/utils";

export const SeriesDetails = () => {
  const data = mockSeries;
  return (
    <div className={styles.container}>
      <Heading as="h2" size="6">
        {data.name}
      </Heading>
      <div className={styles.description}>
        <Image
          src={data.imageUrl}
          alt={data.name}
          objectFit="cover"
          width={100}
          height={100}
        />
        <div className={styles.descriptionText}>
          <Text wrap="pretty">{truncate(data.description, 100)}</Text>
          <LinkOut href={data.websiteUrl}>More details.</LinkOut>
        </div>
      </div>
      <EpisodeList episodes={data.episodes} imgSrc={data.imageUrl} />
    </div>
  );
};
