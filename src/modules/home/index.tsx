"use client";
import { TopTen } from "@/domains/topTen/TopTen";
import { client } from "@/lib/podcastApi";
import { ApolloProvider } from "@apollo/client";

export const Home = () => {
  return (
    <main>
      <ApolloProvider client={client}>
        <TopTen />
      </ApolloProvider>
    </main>
  );
};
