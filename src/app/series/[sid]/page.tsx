import { Series } from "@/modules/series";

export default function SeriesPage({ params }: { params: { sid: string } }) {
  return <Series uuid={params.sid} />;
}
