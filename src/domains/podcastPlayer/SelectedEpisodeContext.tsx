import { Episode } from "@/models/Episode"
import { createContext, useContext, useMemo, useState } from "react"

type SelectedEpisode = Episode & {
  setSelectedEpisode: (episode: Episode) => void
}

const defaultValue: SelectedEpisode = {
  audioUrl: null,
  authorName: null,
  completed: false,
  datePublished: null,
  description: null,
  duration: null,
  episodeNumber: null,
  imageUrl: null,
  listens: null,
  name: null,
  series: null,
  seriesUuid: null,
  seasonNumber: null,
  subtitle: null,
  uuid: "",
  websiteUrl: null,
  setSelectedEpisode: () => {},
}

export const SelectedEpisodeContext =
  createContext<Partial<SelectedEpisode>>(defaultValue)

type SelectedEpisodeProviderProps = {
  children: React.ReactNode
  episode: string
}

export const SelectedEpisodeProvider = ({
  children,
}: SelectedEpisodeProviderProps) => {
  const [episode, setSelectedEpisode] = useState<Partial<SelectedEpisode>>()
  const value = useMemo(() => {
    return {
      ...(episode ?? defaultValue),
      setSelectedEpisode,
    }
  }, [episode])

  return (
    <SelectedEpisodeContext.Provider value={value}>
      {children}
    </SelectedEpisodeContext.Provider>
  )
}

export const useSelectedEpisode = () => {
  return useContext(SelectedEpisodeContext)
}
