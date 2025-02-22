import { GET_PODCAST_EPISODE } from "@/gql"
import { useQuery } from "@apollo/client"

export const useEpisodeDetail = ({ uuid }: { uuid: string }) => {
  const { data, loading, error } = useQuery(GET_PODCAST_EPISODE, {
    variables: { uuid },
  })

  return {
    data: data?.getPodcastEpisode,
    loading,
    error,
  }
}
