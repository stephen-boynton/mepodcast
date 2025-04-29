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
import { PlaylistService } from '@/services/PlaylistService'
import { FALSE } from '@/db/constants'

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
  const [autoPlaylist, setAutoPlaylist] = useState<Playlist | null>(null)

  const [playlists, setPlaylists] = useState<PlaylistData[]>(
    playlistController.getPlaylists()
  )

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    playlistController.getSelectedPlaylist()
  )

  const saveCurrentPlaylist = useCallback(async () => {
    if (selectedPlaylist) {
      await PlaylistService.updatePlaylist(selectedPlaylist)
      return
    }
    Logger.warn('saveCurrentPlaylist: No current playlist')
  }, [selectedPlaylist])

  const updatePlaylists = useCallback(() => {
    setPlaylists(playlistController.getPlaylists())
  }, [])

  const createPlaylist = useCallback(
    async ({ name, description, episode }: CreatePlaylistArgs) => {
      const newPlaylist = await PlaylistService.createPlaylist(
        new Playlist({
          name,
          description,
          episodes: episode ? [episode] : [],
          isAutoPlaylist: FALSE,
          isCurrentPlaylist: FALSE,
          cursor: 0
        })
      )
      playlistController.addPlaylist(newPlaylist)
      updatePlaylists()
      return newPlaylist
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
      await saveCurrentPlaylist()
    },
    [selectedPlaylist, saveCurrentPlaylist]
  )

  const addAsPlayNext = useCallback(
    async (episode: Episode) => {
      await selectedPlaylist?.addAsPlayNext(episode)
    },
    [selectedPlaylist]
  )

  const addAsCurrentlyPlaying = useCallback(
    async (episode: Episode) => {
      // Get or set selected playlist
      let currentPlaylist = selectedPlaylist
      if (!currentPlaylist) {
        Logger.warn('No current playlist, attempting to set')
        currentPlaylist = await playlistController.getSelectedPlaylist()
        if (!currentPlaylist) {
          Logger.error('No current playlist')
          return
        }
        setSelectedPlaylist(currentPlaylist)
      }

      // Check if episode already exists in current playlist
      const existingEpisode = currentPlaylist.episodes.find(
        (ep) => ep.uuid === episode.uuid
      )

      if (existingEpisode) {
        // Move existing episode to top of playlist
        Logger.debug('Episode already exists in playlist')
        await currentPlaylist.changeEpisodeOrder(existingEpisode.uuid, 0)
        currentPlaylist.cursor = 0
        await saveCurrentPlaylist()
        return
      }

      // Handle adding new episode
      if (currentPlaylist.isAutoPlaylist) {
        // Add directly to current auto playlist
        Logger.debug('Adding episode to auto playlist')
        await currentPlaylist.addAsCurrentlyPlaying(episode)
        await saveCurrentPlaylist()
        return
      }

      // Get or create auto playlist for non-auto playlists
      let targetAutoPlaylist = autoPlaylist
      if (!targetAutoPlaylist) {
        const fetchedAutoPlaylist = await PlaylistService.getAutoPlaylist()
        if (!fetchedAutoPlaylist) {
          Logger.error('No auto playlist')
          return
        }
        targetAutoPlaylist = new Playlist(fetchedAutoPlaylist)
        setAutoPlaylist(targetAutoPlaylist)
      }

      // Switch to auto playlist and add episode
      Logger.debug('Selecting auto playlist')
      if (targetAutoPlaylist.id) {
        await playlistController.selectPlaylist(targetAutoPlaylist.id)
      }
      Logger.debug('Adding episode to selected auto playlist')
      await targetAutoPlaylist.addAsCurrentlyPlaying(episode)
      await saveCurrentPlaylist()
    },
    [selectedPlaylist, autoPlaylist, saveCurrentPlaylist]
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
