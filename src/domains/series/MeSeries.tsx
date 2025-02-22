"use client";
import { Grid } from "@radix-ui/themes";
import { useSubscribedSeries } from "./hooks/useSubscribedSeries";
import { PodcastCard } from "@/components/PodcastCard";
import Link from "next/link";

export const MeSeries = () => {
  const { subscribed } = useSubscribedSeries();

  return (
    <Grid columns="repeat(auto-fill, minmax(8rem, 1fr))" gap="4">
      {subscribed?.map((series) => (
        <Link key={series.id} href={`/series/${series.uuid}`}>
          <PodcastCard details={series} renderButton={() => {}} />
        </Link>
      ))}
    </Grid>
  );
};
