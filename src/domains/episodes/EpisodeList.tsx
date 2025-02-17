import { EpisodeDetails } from "./types";
import styles from "./EpisodeList.style.module.scss";
import { Heading } from "@radix-ui/themes";
import { ListCard } from "@/components/ListCard";

export const EpisodeList = ({
  seriesId,
  episodes,
  imgSrc,
}: {
  seriesId: string;
  episodes: EpisodeDetails[];
  imgSrc: string;
}) => {
  return (
    <div>
      <Heading as="h3" mb="4" weight="bold">
        Episodes:
      </Heading>
      <ul className={styles.container}>
        {episodes.map((episode) => {
          return (
            <ListCard
              key={episode.uuid}
              href={`/series/${seriesId}/episodes/${episode.uuid}`}
              name={episode.name}
              description={episode.description}
              imgSrc={imgSrc}
            />
          );
        })}
      </ul>
    </div>
  );
};
