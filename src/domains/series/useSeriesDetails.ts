import { GET_PODCASTSERIES } from "@/gql";
import { useQuery } from "@apollo/client";

export const useSeriesDetails = ({ uuid }: { uuid: string }) => {
  const { data, loading, error } = useQuery(GET_PODCASTSERIES, {
    variables: { uuid },
  });
  console.log({ data });
  return {
    data: data?.getPodcastSeries,
    loading,
    error,
  };
};
