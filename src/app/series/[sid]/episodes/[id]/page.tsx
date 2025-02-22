import { Episode } from "@/modules/episode"

export default async function Episodes({ params }: { params: { id: string } }) {
  const { id } = await params
  return <Episode id={id} />
}
