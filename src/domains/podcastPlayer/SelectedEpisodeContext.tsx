'use client'
import { Episode } from '@/models/Episode'
import { createContext, useContext, useMemo, useState } from 'react'
import { useEpisodeDetail } from '../episodes/useEpisodeDetails'

type SelectedEpisode = {
  episode: Partial<Episode>
  setSelectedEpisode: (episodeUuid: string) => void
}

export const defaultSelectedEpisode: SelectedEpisode = {
  episode: {
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
    uuid: '',
    websiteUrl: null
  },
  setSelectedEpisode: () => {}
}

export const SelectedEpisodeContext = createContext<Partial<SelectedEpisode>>(
  defaultSelectedEpisode
)

type SelectedEpisodeProviderProps = {
  children: React.ReactNode
  episode?: string
}

export const SelectedEpisodeProvider = ({
  children
}: SelectedEpisodeProviderProps) => {
  const [selectedEpisodeUuid, setSelectedEpisode] = useState<string>('')
  const { data: episode = defaultSelectedEpisode.episode, error } =
    useEpisodeDetail({
      uuid: selectedEpisodeUuid
    })

  const value = useMemo(() => {
    return {
      error,
      episode,
      setSelectedEpisode
    }
  }, [episode, error])

  return (
    <SelectedEpisodeContext.Provider value={value}>
      {children}
    </SelectedEpisodeContext.Provider>
  )
}

export const useSelectedEpisode = () => {
  return useContext(SelectedEpisodeContext)
}
