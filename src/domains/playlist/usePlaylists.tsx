'use client'
import { Playlist } from '@/models/Playlist'
import { Episode } from '@/models/Episode'
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
import { playlistController } from '@/controllers/PlaylistController'
import { saveCurrentlyPlaying } from '@/db/operations/currentlyPlaying'

type CreatePlaylistArgs = {
  name: string
  description: string
  episode?: Episode
}

export type PlaylistContext = {
  addAsCurrentlyPlaying: (episode: Episode) => Promise<Episode>
  addAsPlayNext: (episode: Episode) => void
  addEpisodeToPlaylist: (episode: Episode) => void
  changeEpisodeOrder: (uuid: string, index: number) => Promise<void>
  clearPlaylist: () => Promise<void>
  createPlaylist: (args: CreatePlaylistArgs) => Promise<Playlist>
  removeEpisodeFromPlaylist: (uuid: string) => void
  transferCurrentPlayist: (playlist: PlaylistData) => Promise<void>
  updateAutoPlaylist: (playlist: PlaylistData) => Promise<void>
  updatePlaylist: (playlist: PlaylistData) => Promise<void>
  currentEpisode: Episode | null
  playlistInitialized: boolean
  playlists: PlaylistData[]
  selectedPlaylist: Playlist | null
}

const PlaylistContext = createContext<Partial<PlaylistContext>>({
  addAsPlayNext: () => {},
  removeEpisodeFromPlaylist: () => {},
  addEpisodeToPlaylist: () => {},
  playlistInitialized: false,
  selectedPlaylist: null,
  playlists: []
})

export const PlaylistProvider = ({ children }: React.PropsWithChildren) => {
  const [initialized, setInitialized] = useState(false)
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const playlists = playlistController.getPlaylists()
  const selectedPlaylist = playlistController.getSelectedPlaylist()
  const autoPlaylist = playlistController.getAutoPlaylist()

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

  const changeEpisodeOrder = useCallback(
    async (uuid: string, index: number) => {
      await selectedPlaylist?.changeEpisodeOrder(uuid, index)
    },
    [selectedPlaylist]
  )

  const clearPlaylist = useCallback(async () => {
    await selectedPlaylist?.clearPlaylist()
  }, [selectedPlaylist])

  const transferCurrentPlayist = useCallback(
    async (newPlaylist: PlaylistData) => {
      await Playlist.transferCurrentPlayist(newPlaylist)
    },
    []
  )

  const removeEpisodeFromPlaylist = useCallback(
    async (uuid: string) => {
      await selectedPlaylist?.removeEpisodeFromPlaylist(uuid)
    },
    [selectedPlaylist]
  )

  const addEpisodeToPlaylist = useCallback(
    async (episode: Episode) => {
      await selectedPlaylist?.addEpisodeToPlaylist(episode)
    },
    [selectedPlaylist]
  )

  const addAsPlayNext = useCallback(
    async (episode: Episode) => {
      await selectedPlaylist?.addAsPlayNext(episode)
    },
    [selectedPlaylist]
  )

  const addAsCurrentlyPlaying = useCallback(
    async (episode: Episode) => {
      if (!selectedPlaylist) {
        console.log({ selectedPlaylist, autoPlaylist })
        Logger.error('No current playlist')
        return
      }

      const exists = selectedPlaylist?.episodes.find(
        (ep) => ep.uuid === episode.uuid
      )

      if (exists) {
        Logger.debug('Episode already exists in playlist')
        await selectedPlaylist?.changeEpisodeOrder(exists.uuid, 0)
        selectedPlaylist.cursor = 0
      } else {
        if (selectedPlaylist.isAutoPlaylist) {
          Logger.debug('Adding episode to (selected) auto playlist')
          selectedPlaylist.cursor = selectedPlaylist.episodes.length
          await selectedPlaylist?.addAsCurrentlyPlaying(episode)
        } else {
          if (!autoPlaylist) {
            Logger.error('No auto playlist')
            return
          }

          Logger.debug('Adding episode to (moving selcected) auto playlist')
          await autoPlaylist?.makeCurrentPlaylist()
          autoPlaylist.cursor = autoPlaylist.episodes.length
          await autoPlaylist?.addAsCurrentlyPlaying(episode)
        }
      }
    },
    [selectedPlaylist, autoPlaylist]
  )

  useEffect(() => {
    if (selectedPlaylist && !initialized) {
      Logger.debug('Loaded Selected Playlist')
      setInitialized(true)
      const currentEpisode = selectedPlaylist.getCurrent()
      if (currentEpisode) {
        setCurrentEpisode(currentEpisode)
      }
    }
  }, [selectedPlaylist, initialized])

  const value = useMemo(
    () => ({
      addAsCurrentlyPlaying,
      addAsPlayNext,
      addEpisodeToPlaylist,
      createPlaylist,
      changeEpisodeOrder,
      clearPlaylist,
      currentEpisode,
      playlistsInitialized: initialized,
      removeEpisodeFromPlaylist,
      transferCurrentPlayist,
      selectedPlaylist,
      playlists
    }),
    [
      addAsCurrentlyPlaying,
      addAsPlayNext,
      addEpisodeToPlaylist,
      createPlaylist,
      changeEpisodeOrder,
      clearPlaylist,
      currentEpisode,
      initialized,
      removeEpisodeFromPlaylist,
      transferCurrentPlayist,
      selectedPlaylist,
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
