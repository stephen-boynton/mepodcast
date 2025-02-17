"use client";
import { SeriesDetails } from "@/domains/series/Series";
import { client } from "@/lib/podcastApi";
import { ApolloProvider } from "@apollo/client";

export const Series = ({ uuid }: { uuid: string }) => {
  return (
    <main>
      <ApolloProvider client={client}>
        <SeriesDetails uuid={uuid} />
      </ApolloProvider>
    </main>
  );
};
