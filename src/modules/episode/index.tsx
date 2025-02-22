"use client"
import { EpisodeDetail } from "@/domains/episodes/Episode"
import { SelectedEpisodeProvider } from "@/domains/podcastPlayer/SelectedEpisodeContext"
import { client } from "@/lib/podcastApi"
import { ApolloProvider } from "@apollo/client"

export const Episode = ({ id }: { id: string }) => {
  return (
    <main>
      <SelectedEpisodeProvider episode={id}>
        <ApolloProvider client={client}>
          <EpisodeDetail />
        </ApolloProvider>
      </SelectedEpisodeProvider>
    </main>
  )
}
