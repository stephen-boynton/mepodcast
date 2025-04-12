'use client'
import { createStore } from 'zustand'
import { Maybe } from '@/types/shared'
import { db } from '@/db'
import { initializePlaylist, Playlist } from '@/models/Playlist'
import { Logger } from '@/lib/Logger'
import { FALSE, TRUE } from '@/db/constants'
import { PodcastPlayer } from '@/models/Player'
import { getPlaylists } from '@/db/operations/playlist'

export type PlayerControllerState = {
  addPlaylist: (playlist: Playlist) => void
  bulkAddPlaylist: (playlists: Playlist[]) => void
  cursor: number
  nextPlaylist: () => void
  playlists: Playlist[]
  populatePlaylists: () => void
  prevPlaylist: () => void
  removePlaylist: (playlistId: number) => void
  selectedPlaylist: Maybe<Playlist>
  selectPlaylist: (playlistId: number) => void
  setCursor: (cursor: number) => void
}

export const playlistControllerStore = createStore<PlayerControllerState>(
  (set, get) => ({
    selectedPlaylist: null,
    playlists: [],
    cursor: 0,

    addPlaylist: async (playlist: Playlist) => {
      const episodeData = playlist.episodes.map((episode) => episode.toDto())
      playlist.episodes = episodeData
      console.log({ playlist })
      set((state) => ({
        playlists: [...state.playlists, playlist]
      }))
    },

    bulkAddPlaylist: async (playlists: Playlist[]) => {
      set((state) => ({
        playlists: [...state.playlists, ...playlists]
      }))
    },

    async removePlaylist(playlistId: number) {
      set((state) => {
        const location = state.playlists.findIndex((p) => p.id === playlistId)
        if (state.cursor <= location) {
          state.cursor -= 1
        }
        return {
          playlists: state.playlists.filter((p) => p.id !== playlistId)
        }
      })
    },

    selectPlaylist: async (playlistId: number) => {
      set((state) => {
        const selected = state.playlists.find((p) => p.id === playlistId)

        if (!selected) {
          Logger.error(`Playlist not found to select: ${playlistId}`)
          return {
            selectedPlaylist: null
          }
        }

        selected.isCurrentPlaylist = TRUE

        if (state.selectedPlaylist) {
          state.selectedPlaylist.isCurrentPlaylist = FALSE
        }

        return {
          selectedPlaylist: state.playlists.find((p) => p.id === playlistId)
        }
      })
    },

    nextPlaylist: async () => {
      set((state) => ({
        curssor: state.cursor++,
        selectedPlaylist: state.playlists[state.cursor]
      }))
    },

    populatePlaylists: async () => {
      const _playlists = (await getPlaylists()) || []

      Logger.debug('Populating Playlists')

      const playlists = _playlists.map((p) => initializePlaylist(p))
      const currenPlaylist = playlists.find((p) => p?.isCurrentPlaylist)

      Logger.debug('Playlists populated', playlists)

      if (currenPlaylist) {
        Logger.debug(
          'Playlist Controller: Current Playlist found',
          currenPlaylist
        )
        return set({ playlists, selectedPlaylist: currenPlaylist })
      }

      const autoPlaylist = await Playlist.createAutoPlaylist({
        name: 'Auto Playlist',
        isCurrentPlaylist: TRUE
      })

      set((state) => ({
        ...state,
        playlists: [autoPlaylist],
        selectedPlaylist: autoPlaylist
      }))

      Logger.debug('New Auto Playlist populated', get())
    },

    prevPlaylist() {
      set((state) => ({
        cursor: (state.cursor -= 1),
        selectedPlaylist: state.playlists[state.cursor]
      }))
    },

    setCursor: (cursor: number) => set({ cursor })
  })
)

export class PlaylistController {
  store = playlistControllerStore
  static #instance?: PlaylistController
  player?: PodcastPlayer

  constructor() {
    if (PlaylistController.#instance) {
      // If the instance is already created, just return the existing instance.
      return PlaylistController.#instance
    }
    Logger.debug('Initializing Playlist Controller')
    // Populate the playlists from the database when the controller is created.
    this.store.getState().populatePlaylists()
    // Save the instance in the #instance variable.
    PlaylistController.#instance = this
  }

  async addPlaylist(playlist: Playlist) {
    await this.store.getState().addPlaylist(playlist)
  }

  getPlaylists() {
    return this.store.getState().playlists
  }

  getAutoPlaylist() {
    return this.store.getState().playlists.find((p) => p.isAutoPlaylist)
  }

  getSelectedPlaylist() {
    return this.store.getState().selectedPlaylist
  }

  nextPlaylist() {
    this.store.getState().nextPlaylist()
  }

  prevPlaylist() {
    this.store.getState().prevPlaylist()
  }

  removePlaylist(playlistId: number) {
    this.store.getState().removePlaylist(playlistId)
  }

  selectPlaylist(playlistId: number) {
    const selected = this.store
      .getState()
      .playlists.find((p) => p.id === playlistId)
    this.store.setState({ selectedPlaylist: selected })
  }
}

export const playlistController = new PlaylistController()
