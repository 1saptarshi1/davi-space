import { create } from 'zustand'
import { fetchMedia, addMedia, toggleFavorite, deleteMedia } from './media.api'
import { detectPlatform } from './media.utils'

export const useMediaStore = create((set, get) => ({
  items: [],
  loading: false,
  searchQuery: '',
  filterPlatform: 'all',
  showFavOnly: false,

  loadMedia: async (userId) => {
    set({ loading: true })
    const { data } = await fetchMedia(userId)
    set({ items: data || [], loading: false })
  },

  addItem: async (url, meta, userId) => {
    const platform = detectPlatform(url)
    const { data, error } = await addMedia({
      user_id: userId,
      url,
      platform,
      title: meta.title,
      tags: meta.tags,
      favorite: false,
    })
    if (!error && data) {
      set(state => ({ items: [data, ...state.items] }))
    }
    return { error }
  },

  toggleFavorite: async (id, current) => {
    const { data, error } = await toggleFavorite(id, current)
    if (!error && data) {
      set(state => ({
        items: state.items.map(i => i.id === id ? data : i)
      }))
    }
  },

  deleteItem: async (id) => {
    const { error } = await deleteMedia(id)
    if (!error) {
      set(state => ({ items: state.items.filter(i => i.id !== id) }))
    }
    return { error }
  },

  getFiltered: () => {
    const { items, searchQuery, filterPlatform, showFavOnly } = get()
    let result = [...items]

    if (showFavOnly) result = result.filter(i => i.favorite)

    if (filterPlatform !== 'all') {
      result = result.filter(i => i.platform === filterPlatform)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(i =>
        i.title?.toLowerCase().includes(q) ||
        i.tags?.toLowerCase().includes(q) ||
        i.url?.toLowerCase().includes(q)
      )
    }

    return result
  },

  setSearch: (q) => set({ searchQuery: q }),
  setFilterPlatform: (p) => set({ filterPlatform: p }),
  toggleFavOnly: () => set(s => ({ showFavOnly: !s.showFavOnly })),
}))