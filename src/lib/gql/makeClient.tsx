'use client'
import { HttpLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache
} from '@apollo/experimental-nextjs-app-support'

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.TADDY_API_URL,
    headers: {
      'X-USER-ID': process.env.TADDY_USER_ID || '',
      'X-API-KEY': process.env.TADDY_API_KEY || ''
    }
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink
  })
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )
}
