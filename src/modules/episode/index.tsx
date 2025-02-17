"use client";
import { EpisodeDetail } from "@/domains/episodes/Episode";
import { client } from "@/lib/podcastApi";
import { ApolloProvider } from "@apollo/client";

export const Episode = ({ id }: { id: string }) => {
  return (
    <main>
      <ApolloProvider client={client}>
        <EpisodeDetail id={id} />
      </ApolloProvider>
    </main>
  );
};
