import { Series } from "@/modules/series"

export default async function SeriesPage({
  params,
}: {
  params: { sid: string }
}) {
  const { sid } = await params
  return <Series uuid={sid} />
}
