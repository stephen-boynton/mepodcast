import { EpisodeDetails } from "@/domains/episodes/types";
import { SeriesDetail } from "@/domains/series/types";
import { Display, DisplayType } from "@/types/shared";

export const truncate = (str: string, n: number) => {
  return str.length > n ? `${str.slice(0, n - 1)}...` : str;
};

export const isSeries = (podcast: EpisodeDetails | SeriesDetail): boolean => {
  return "episodes" in podcast;
};

export const podcastDtoToDisplay = (
  podcast: EpisodeDetails | SeriesDetail
): Display => {
  const isPodcastSeries = isSeries(podcast);

  if (isPodcastSeries) {
    return {
      type: "series" as DisplayType,
      uuid: podcast.uuid,
      name: podcast.name,
      authorName: podcast.authorName,
      description: podcast.description,
      imageUrl: podcast.imageUrl,
      totalEpisodesCount: podcast.totalEpisodesCount,
      websiteUrl: podcast.websiteUrl,
    };
  }

  const { podcastSeries } = podcast;

  return {
    type: "episode" as DisplayType,
    uuid: podcast.uuid,
    name: podcast.name,
    authorName: podcastSeries?.authorName,
    description: podcast.description || podcastSeries?.description,
    imageUrl: podcast.imageUrl,
    totalEpisodesCount: podcastSeries?.totalEpisodesCount,
    websiteUrl: podcast.websiteUrl,
  };
};
