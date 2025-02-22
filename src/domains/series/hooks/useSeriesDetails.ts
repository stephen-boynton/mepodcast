import { getSeriesProgress } from "@/db/operations"
import { GET_PODCASTSERIES } from "@/gql"
import { useQuery } from "@apollo/client"
import { useLiveQuery } from "dexie-react-hooks"

export const useSeriesDetails = ({ uuid }: { uuid: string }) => {
  const { data, loading, error } = useQuery(GET_PODCASTSERIES, {
    variables: { uuid },
  })

  const seriesProgress = useLiveQuery(() => getSeriesProgress(uuid), [uuid])

  let dataWithProgress = data?.getPodcastSeries
  if (dataWithProgress && seriesProgress) {
    dataWithProgress = {
      ...dataWithProgress,
      progress: seriesProgress,
    }
  }

  return {
    data: dataWithProgress,
    loading,
    error,
  }
}
