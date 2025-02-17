import { Heading, Text } from "@radix-ui/themes";
import styles from "./Episode.style.module.scss";
import Image from "next/image";
import { PodcastPlayer } from "../podcastPlayer/PodcastPlayer";
import sanitizeHtml from "sanitize-html";
import { LinkOut } from "@/components/Link/LinkOut";
import { useEpisodeDetail } from "./useEpisodeDetails";

const clean = (dirty: string) =>
  sanitizeHtml(dirty, {
    allowedTags: ["b", "i", "em", "strong", "a", "p", "ul", "ol", "li"],
    allowedAttributes: {
      a: ["href"],
    },
  });

export const EpisodeDetail = ({ id }: { id: string }) => {
  const { data, error, loading } = useEpisodeDetail({ id });

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <Heading className={styles.title} size="6" as="h2">
        {data.name}
      </Heading>
      <Heading className={styles.subtitle} size="5" as="h3">
        <LinkOut href={data.websiteUrl || data.podcastSeries.websiteUrl}>
          {data.podcastSeries.name}
        </LinkOut>
      </Heading>
      <div className={styles.episodeTimer}>
        <Text className={styles.seasonEpisode}>
          Season {data.seasonNumber} Episode {data.episodeNumber}
        </Text>
        <Text>{new Date(data.datePublished).toDateString()}</Text>
      </div>
      <div className={styles.podcastPlayerContainer}>
        <div>
          <Image
            src={data.imageUrl || data.podcastSeries.imageUrl}
            alt={data.name}
            objectFit="cover"
            width={100}
            height={100}
          />
          <PodcastPlayer src={data.audioUrl} />
        </div>
        <Text
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: clean(data.description) }}
        />
      </div>
    </div>
  );
};
