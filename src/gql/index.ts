import { gql } from "@apollo/client";

export const GET_PODCAST_EPISODE = gql`
  query podcastEpisode($uuid: ID) {
    getPodcastEpisode(uuid: $uuid) {
      uuid
      name
      description
      imageUrl
      subtitle
      datePublished
      audioUrl
      duration
      seasonNumber
      episodeNumber
      websiteUrl
      podcastSeries {
        uuid
        name
        authorName
        totalEpisodesCount
        imageUrl
      }
    }
  }
`;

export const GET_PODCASTSERIES = gql`
  query getPodcastSeries($uuid: ID) {
    getPodcastSeries(uuid: $uuid) {
      uuid
      hash
      name
      description
      imageUrl
      datePublished
      language
      seriesType
      contentType
      isExplicitContent
      copyright
      websiteUrl
      rssUrl
      rssOwnerName
      rssOwnerPublicEmail
      authorName
      isCompleted
      isBlocked
      itunesId
      genres
      childrenHash
      itunesInfo {
        uuid
        publisherId
        publisherName
        baseArtworkUrl
        baseArtworkUrlOf(size: 640)
      }
    }
  }
`;

export const SEARCH_FOR_TERM_QUERY = gql`
  query searchForTerm(
    $term: String
    $page: Int
    $limitPerPage: Int
    $filterForTypes: [TaddyType]
    $filterForCountries: [Country]
    $filterForLanguages: [Language]
    $filterForGenres: [Genre]
    $filterForSeriesUuids: [ID]
    $filterForNotInSeriesUuids: [ID]
    $isExactPhraseSearchMode: Boolean
    $isSafeMode: Boolean
    $searchResultsBoostType: SearchResultBoostType
  ) {
    searchForTerm(
      term: $term
      page: $page
      limitPerPage: $limitPerPage
      filterForTypes: $filterForTypes
      filterForCountries: $filterForCountries
      filterForLanguages: $filterForLanguages
      filterForGenres: $filterForGenres
      filterForSeriesUuids: $filterForSeriesUuids
      filterForNotInSeriesUuids: $filterForNotInSeriesUuids
      isExactPhraseSearchMode: $isExactPhraseSearchMode
      isSafeMode: $isSafeMode
      searchResultsBoostType: $searchResultsBoostType
    ) {
      searchId
      podcastSeries {
        uuid
        name
        rssUrl
        itunesId
      }
      podcastEpisodes {
        uuid
        guid
        name
        audioUrl
      }
    }
  }
`;
