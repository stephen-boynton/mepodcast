"use client";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";
import { useState } from "react";
import { ApolloProvider, useQuery } from "@apollo/client";
import { client } from "@/lib/podcastApi";
import { GET_PODCAST_EPISODE, SEARCH_FOR_TERM_QUERY } from "@/gql";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);
  const [query, setQuery] = useState(params.get("query") || "");

  const { data: result, error } = useQuery(SEARCH_FOR_TERM_QUERY, {
    variables: {
      query,
    },
    // skip: !searchTerm,
    skip: true,
    errorPolicy: "all",
  });

  if (error) console.error(error);

  const handleSearch = () => {
    if (query) {
      setSearchTerm(query);
      params.set("query", query);
    } else {
      setSearchTerm("");
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <TextField.Root
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      }}
      placeholder="Search for a podcast"
      size="3"
      value={query}
    >
      <TextField.Slot>
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
    </TextField.Root>
  );
};

export const Search = () => {
  return (
    <ApolloProvider client={client}>
      <div>
        <SearchBar />
      </div>
    </ApolloProvider>
  );
};
