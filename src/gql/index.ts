import { gql } from '@apollo/client'

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
      series: podcastSeries {
        uuid
        name
        authorName
        totalEpisodesCount
        imageUrl
      }
    }
  }
`

export const GET_PODCASTSERIES = gql`
  query getPodcastSeries($uuid: ID) {
    getPodcastSeries(uuid: $uuid) {
      authorName
      datePublished
      description
      genres
      imageUrl
      isBlocked
      isCompleted
      isExplicitContent
      name
      rssUrl
      seriesType
      uuid
      websiteUrl
      episodes {
        uuid
        name
        description
        seasonNumber
        episodeNumber
      }
    }
  }
`

export const LOAD_MORE_FROM_SERIES_QUERY = gql`
  query loadMoreFromSeries($uuid: ID, $page: Int, $limitPerPage: Int) {
    getPodcastSeries(uuid: $uuid) {
      uuid
      episodes(page: $page, limitPerPage: $limitPerPage) {
        uuid
        name
        description
        seasonNumber
        episodeNumber
      }
    }
  }
`

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
      series: podcastSeries {
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
`

export const TOP_PODCAST_SERIES = gql`
  query getTopPods {
    getTopChartsByCountry(
      taddyType: PODCASTSERIES
      country: UNITED_STATES_OF_AMERICA
    ) {
      topChartsId
      series: podcastSeries {
        authorName
        datePublished
        description
        imageUrl
        name
        totalEpisodesCount
        uuid
        websiteUrl
      }
    }
  }
`

export const TOP_PODCAST_EPISODES = gql`
  query getTopPods {
    getTopChartsByCountry(
      taddyType: PODCASTEPISODE
      country: UNITED_STATES_OF_AMERICA
    ) {
      topChartsId
      podcastEpisodes {
        audioUrl
        datePublished
        description
        duration
        episodeNumber
        name
        seasonNumber
        uuid
        series: podcastSeries {
          authorName
          description
          imageUrl
          name
          totalEpisodesCount
          uuid
          websiteUrl
        }
      }
    }
  }
`
