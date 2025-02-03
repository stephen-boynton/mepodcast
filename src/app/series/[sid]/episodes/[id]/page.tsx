import { Episode } from "@/domains/episodes/Episode";
import { mockEpisode } from "@/domains/episodes/mocks";

export default function Episodes() {
  const data = mockEpisode;
  return <Episode data={data} />;
}
