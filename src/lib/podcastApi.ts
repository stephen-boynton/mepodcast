import { ApolloClient, InMemoryCache } from "@apollo/client";
console.log(process.env.TADDY_API_URL);
export const client = new ApolloClient({
  uri: process.env.TADDY_API_URL,
  cache: new InMemoryCache(),
  headers: {
    "X-USER-ID": process.env.TADDY_USER_ID || "",
    "X-API-KEY": process.env.TADDY_API_KEY || "",
  },
});
