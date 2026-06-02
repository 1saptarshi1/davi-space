import { create } from 'zustand'
import {
  fetchMemories, addMemory,
  toggleFavorite, deleteMemory, uploadImage
} from './memory.api'

export const useMemoryStore = create((set, get) => ({
  memories: [],
  loading: false,
  uploading: false,
  searchQuery: '',
  filterTag: 'all',
  showFavOnly: false,

  loadMemories: async (userId) => {
    set({ loading: true })
    const { data } = await fetchMemories(userId)
    set({ memories: data || [], loading: false })
  },

  addMemory: async (file, meta, userId) => {
    set({ uploading: true })

    // Upload image first
    const { url, error: uploadError } = await uploadImage(file, userId)
    if (uploadError) {
      set({ uploading: false })
      return { error: uploadError }
    }

    // Save to DB
    const { data, error } = await addMemory({
      user_id: userId,
      image_url: url,
      caption: meta.caption,
      tags: meta.tags,
      favorite: false,
    })

    if (!error && data) {
      set(state => ({ memories: [data, ...state.memories] }))
    }

    set({ uploading: false })
    return { error }
  },

  toggleFavorite: async (id, current) => {
    const { data, error } = await toggleFavorite(id, current)
    if (!error && data) {
      set(state => ({
        memories: state.memories.map(m => m.id === id ? data : m)
      }))
    }
  },

  deleteMemory: async (id, imageUrl) => {
    const { error } = await deleteMemory(id, imageUrl)
    if (!error) {
      set(state => ({
        memories: state.memories.filter(m => m.id !== id)
      }))
    }
    return { error }
  },

  // Filtered memories
  getFiltered: () => {
    const { memories, searchQuery, filterTag, showFavOnly } = get()
    let result = [...memories]

    if (showFavOnly) result = result.filter(m => m.favorite)

    if (filterTag !== 'all') {
      result = result.filter(m =>
        m.tags?.toLowerCase().includes(filterTag.toLowerCase())
      )
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(m =>
        m.caption?.toLowerCase().includes(q) ||
        m.tags?.toLowerCase().includes(q)
      )
    }

    return result
  },

  // Get all unique tags
  getAllTags: () => {
    const { memories } = get()
    const tags = new Set()
    memories.forEach(m => {
      if (m.tags) m.tags.split(',').forEach(t => tags.add(t.trim()))
    })
    return Array.from(tags).filter(Boolean)
  },

  setSearch: (q) => set({ searchQuery: q }),
  setFilterTag: (t) => set({ filterTag: t }),
  toggleFavOnly: () => set(state => ({ showFavOnly: !state.showFavOnly })),
}))