'use client'
import { createStore } from 'zustand'
import { Maybe } from '@/types/shared'
import { initializePlaylist, Playlist } from '@/models/Playlist'
import { Logger } from '@/lib/Logger'
import { FALSE, TRUE } from '@/db/constants'
import { PodcastPlayer } from '@/models/Player'
import { getPlaylists } from '@/db/operations/playlist'
import { Episode } from '@/models/Episode'
import { PlaylistService } from '@/services/PlaylistService'

export type PlayerControllerState = {
  addPlaylist: (playlist: Playlist) => void
  bulkAddPlaylist: (playlists: Playlist[]) => void
  cursor: number
  getSelectedPlaylist: () => Playlist | null
  nextPlaylist: () => void
  playlists: Playlist[]
  populatePlaylists: () => void
  prevPlaylist: () => void
  removePlaylist: (playlistId: number) => void
  reset: () => void
  selectPlaylist: (playlistId: number) => void
  setCursor: (cursor: number) => void
}

export const playlistControllerStore = createStore<PlayerControllerState>(
  (set, get) => ({
    playlists: [],
    cursor: 0,

    addPlaylist: (playlist: Playlist) => {
      const episodeData = playlist.episodes.map((episode) => episode.toDto())
      playlist.episodes = episodeData.map((episode) => new Episode(episode))
      set((state) => ({
        playlists: [...state.playlists, playlist]
      }))
    },

    bulkAddPlaylist: (playlists: Playlist[]) => {
      set((state) => ({
        playlists: [...state.playlists, ...playlists]
      }))
    },

    getSelectedPlaylist() {
      return get().playlists[get().cursor]
    },

    removePlaylist(playlistId: number) {
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

    selectPlaylist: (playlistId: number) => {
      set((state) => {
        const selected = state.playlists.findIndex((p) => p.id === playlistId)
        const prevSelected = state.playlists[state.cursor]

        if (selected === -1) {
          Logger.error(`Playlist not found to select: ${playlistId}`)
          return state
        }

        state.playlists[selected].isCurrentPlaylist = TRUE

        if (prevSelected) {
          prevSelected.isCurrentPlaylist = FALSE
        }

        return {
          ...state,
          cursor: selected
        }
      })
    },

    nextPlaylist: () => {
      const cursor = get().cursor
      set({
        cursor: cursor + 1
      })
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

        return set((state) => ({
          ...state,
          playlists,
          cursor: playlists.findIndex((p) => p.id === currenPlaylist.id)
        }))
      }

      const autoPlaylist = await PlaylistService.createAutoPlaylist(
        initializePlaylist({
          name: 'Auto Playlist',
          isCurrentPlaylist: TRUE
        })
      )

      if (!PlaylistService.isPlaylist(autoPlaylist)) {
        Logger.error('Auto Playlist not created')
        return
      }

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

    getCursor() {
      return get().cursor
    },

    reset() {
      set({
        playlists: [],
        cursor: 0
      })
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

  async bulkAddPlaylist(playlists: Playlist[]) {
    await this.store.getState().bulkAddPlaylist(playlists)
  }

  getPlaylists() {
    return this.store.getState().playlists || []
  }

  getAutoPlaylist() {
    return this.store.getState().playlists.find((p) => p.isAutoPlaylist) || null
  }

  getSelectedPlaylist() {
    return this.store.getState().getSelectedPlaylist() || null
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
      .playlists.findIndex((p) => p.id === playlistId)

    if (selected === -1) {
      Logger.error(`Playlist not found to select: ${playlistId}`)
      return
    }

    this.store.setState({ cursor: selected })
  }
}

export const playlistController = new PlaylistController()
