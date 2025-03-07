import { HttpLink } from '@apollo/client'
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache
} from '@apollo/experimental-nextjs-app-support'

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.TADDY_API_URL,
      headers: {
        'X-USER-ID': process.env.TADDY_USER_ID || '',
        'X-API-KEY': process.env.TADDY_API_KEY || ''
      }
    }),
    cache: new InMemoryCache()
  })
})
