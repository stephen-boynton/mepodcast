import { GET_PODCAST_EPISODE } from "@/gql";
import { useQuery } from "@apollo/client";

export const useEpisodeDetail = ({ id }: { id: string }) => {
  const { data, loading, error } = useQuery(GET_PODCAST_EPISODE, {
    variables: { uuid: id },
  });
  console.log({ data });
  return {
    data: data?.getPodcastEpisode,
    loading,
    error,
  };
};
