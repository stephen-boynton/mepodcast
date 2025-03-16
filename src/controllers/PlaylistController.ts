import { createStore } from 'zustand'
import { Maybe } from '@/types/shared'
import { db } from '@/db'
import { initializePlaylist, Playlist } from '@/models/Playlist'
import { Logger } from '@/lib/Logger'
import { FALSE, TRUE } from '@/db/constants'
import { PodcastPlayer } from '@/models/Player'

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
  (set) => ({
    selectedPlaylist: null,
    playlists: [],
    cursor: 0,
    addPlaylist: async (playlist: Playlist) => {
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
        curssor: (state.cursor += 1),
        selectedPlaylist: state.playlists[state.cursor]
      }))
    },

    populatePlaylists: async () => {
      const _playlists = await db.playlists.toArray()
      if (_playlists.length === 0) {
        const playlists = _playlists.map((p) => initializePlaylist(p))
        set({ playlists })
      } else {
        const autoPlaylist = await Playlist.createAutoPlaylist({
          name: 'Auto Playlist'
        })

        set({ playlists: [autoPlaylist] })
      }
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
      return PlaylistController.#instance
    }
    this.store.getState().populatePlaylists()
  }

  async addPlaylist(playlist: Playlist) {
    await this.store.getState().addPlaylist(playlist)
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
    this.store.getState().selectPlaylist(playlistId)
  }
}

export const playlistController = new PlaylistController()
