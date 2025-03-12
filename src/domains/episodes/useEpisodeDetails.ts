import { GET_PODCAST_EPISODE } from '@/gql'
import { createEpisode, Episode } from '@/models/Episode'
import { useSuspenseQuery } from '@apollo/client'

type UseEpisodeDetailProps = {
  uuid?: string
  isCached?: boolean
}

export const useEpisodeDetail = ({ uuid }: UseEpisodeDetailProps) => {
  const { data, error } = useSuspenseQuery<{ getPodcastEpisode: Episode }>(
    GET_PODCAST_EPISODE,
    {
      variables: { uuid },
      skip: !uuid,
      errorPolicy: 'none'
    }
  )

  return {
    data: data && createEpisode(data.getPodcastEpisode),
    error
  }
}
