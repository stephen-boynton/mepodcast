'use client'
import { Playlist } from '@/models/Playlist'
import { Episode } from '@/models/Episode'
import {
  getAutoPlaylist,
  getPlaylist,
  getPlaylists
} from '@/db/operations/playlist'
import { useLiveQuery } from 'dexie-react-hooks'
import { PlaylistData } from '@/db/Database'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { Logger } from '@/lib/Logger'

type CreatePlaylistArgs = {
  name: string
  description: string
  episode?: Episode
}

export type PlaylistContext = {
  updatePlaylist: (playlist: PlaylistData) => Promise<void>
  updateAutoPlaylist: (playlist: PlaylistData) => Promise<void>
  addAsCurrentlyPlaying: (episode: Episode) => Promise<Episode>
  createPlaylist: (args: CreatePlaylistArgs) => Promise<Playlist>
  createAutoPlaylist: () => Promise<Playlist>
  changeEpisodeOrder: (uuid: string, index: number) => Promise<void>
  clearPlaylist: () => Promise<void>
  transferCurrentPlayist: (playlist: PlaylistData) => Promise<void>
  addAsPlayNext: (episode: Episode) => void
  removeEpisodeFromPlaylist: (uuid: string) => void
  addEpisodeToPlaylist: (episode: Episode) => void
  autoPlaylist: Playlist | null
  currentPlaylist: Playlist | null
  playlists: PlaylistData[]
}

const PlaylistContext = createContext<Partial<PlaylistContext>>({
  addAsPlayNext: () => {},
  removeEpisodeFromPlaylist: () => {},
  addEpisodeToPlaylist: () => {},
  autoPlaylist: null,
  currentPlaylist: null,
  playlists: []
})

export const PlaylistProvider = ({ children }: React.PropsWithChildren) => {
  const [initialized, setInitialized] = useState(false)
  const playlists = useLiveQuery(() => getPlaylists(), [], [])
  const currentPlaylist = useLiveQuery(() => getPlaylist(), [], null)
  const autoPlaylist = useLiveQuery(() => getAutoPlaylist(), [], null)

  const createPlaylist = useCallback(
    async ({ name, description, episode }: CreatePlaylistArgs) => {
      return await Playlist.createPlaylist({
        name,
        description,
        episodes: episode ? [episode] : []
      })
    },
    []
  )

  const createAutoPlaylist = useCallback(async () => {
    return await Playlist.createAutoPlaylist({
      name: 'Auto-Playlist',
      description: 'Auto-Playlist',
      episodes: []
    })
  }, [])

  const changeEpisodeOrder = useCallback(
    async (uuid: string, index: number) => {
      await currentPlaylist?.changeEpisodeOrder(uuid, index)
    },
    [currentPlaylist]
  )

  const clearPlaylist = useCallback(async () => {
    await currentPlaylist?.clearPlaylist()
  }, [currentPlaylist])

  const transferCurrentPlayist = useCallback(
    async (newPlaylist: PlaylistData) => {
      await Playlist.transferCurrentPlayist(newPlaylist)
    },
    []
  )

  const removeEpisodeFromPlaylist = useCallback(
    async (uuid: string) => {
      await currentPlaylist?.removeEpisodeFromPlaylist(uuid)
    },
    [currentPlaylist]
  )

  const addEpisodeToPlaylist = useCallback(
    async (episode: Episode) => {
      await currentPlaylist?.addEpisodeToPlaylist(episode)
    },
    [currentPlaylist]
  )

  const addAsPlayNext = useCallback(
    async (episode: Episode) => {
      await currentPlaylist?.addAsPlayNext(episode)
    },
    [currentPlaylist]
  )

  const addAsCurrentlyPlaying = useCallback(
    async (episode: Episode) => {
      if (!currentPlaylist) {
        Logger.error('No current playlist')
        return
      }

      const exists = currentPlaylist?.episodes.find(
        (ep) => ep.uuid === episode.uuid
      )

      if (exists) {
        await currentPlaylist?.changeEpisodeOrder(episode.uuid, 0)
        currentPlaylist.cursor = 0
      } else {
        await currentPlaylist?.addEpisodeToPlaylist(episode)
        currentPlaylist.cursor = currentPlaylist.episodes.length
      }

      await currentPlaylist.save()
      return currentPlaylist.getCurrent()
    },
    [currentPlaylist]
  )

  useEffect(() => {
    if (initialized) return
    if (autoPlaylist === null && !initialized) {
      createAutoPlaylist()
      Logger.debug('Initializzed Auto Playlist')
      return
    }

    if (autoPlaylist && currentPlaylist === null && !initialized) {
      Playlist.transferCurrentPlayist(autoPlaylist)
      setInitialized(true)
    }
  }, [autoPlaylist, createAutoPlaylist, currentPlaylist, initialized])

  const value = useMemo(
    () => ({
      addAsCurrentlyPlaying,
      addAsPlayNext,
      addEpisodeToPlaylist,
      autoPlaylist,
      createAutoPlaylist,
      createPlaylist,
      changeEpisodeOrder,
      clearPlaylist,
      removeEpisodeFromPlaylist,
      transferCurrentPlayist,
      currentPlaylist,
      playlists
    }),
    [
      addAsCurrentlyPlaying,
      addAsPlayNext,
      autoPlaylist,
      createAutoPlaylist,
      addEpisodeToPlaylist,
      createPlaylist,
      changeEpisodeOrder,
      clearPlaylist,
      removeEpisodeFromPlaylist,
      transferCurrentPlayist,
      currentPlaylist,
      playlists
    ]
  )

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  )
}

export const usePlaylists = () => useContext(PlaylistContext)
