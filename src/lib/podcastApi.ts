import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: process.env.TADDY_API_URL,
  cache: new InMemoryCache(),
  headers: {
    "X-USER-ID": process.env.TADDY_USER_ID || "",
    "X-API-KEY": process.env.TADDY_API_KEY || "",
  },
});
