import { GET_PODCAST_EPISODE } from '@/gql'
import { PreloadQuery } from '@/lib/gql/podcastApi'
import { Episode } from '@/modules/episode'
import { Suspense } from 'react'

export default async function Episodes({ params }: { params: { id: string } }) {
  const { id } = await params
  return (
    <PreloadQuery query={GET_PODCAST_EPISODE} variables={{ uuid: id }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Episode id={id} />
      </Suspense>
    </PreloadQuery>
  )
}
