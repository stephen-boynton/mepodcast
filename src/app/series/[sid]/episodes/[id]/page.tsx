import { Episode } from "@/modules/episode";

export default function Episodes({ params }: { params: { id: string } }) {
  return <Episode id={params.id} />;
}
