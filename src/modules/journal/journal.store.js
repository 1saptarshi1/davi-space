import { create } from 'zustand'
import { fetchEntries, addEntry, updateEntry, deleteEntry } from './journal.api'

export const useJournalStore = create((set, get) => ({
  entries: [],
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'newest',
  filterMood: 'all',

  // Load all entries
  loadEntries: async (userId) => {
    set({ loading: true, error: null })
    const { data, error } = await fetchEntries(userId)
    if (error) set({ error: error.message, loading: false })
    else set({ entries: data || [], loading: false })
  },

  // Add entry
  addEntry: async (entry) => {
    const { data, error } = await addEntry(entry)
    if (!error && data) {
      set(state => ({ entries: [data, ...state.entries] }))
    }
    return { error }
  },

  // Update entry
  updateEntry: async (id, updates) => {
    const { data, error } = await updateEntry(id, updates)
    if (!error && data) {
      set(state => ({
        entries: state.entries.map(e => e.id === id ? data : e)
      }))
    }
    return { error }
  },

  // Delete entry
  deleteEntry: async (id) => {
    const { error } = await deleteEntry(id)
    if (!error) {
      set(state => ({
        entries: state.entries.filter(e => e.id !== id)
      }))
    }
    return { error }
  },

  // Search + filter + sort (computed)
  getFiltered: () => {
    const { entries, searchQuery, sortBy, filterMood } = get()
    let result = [...entries]

    // Filter by mood
    if (filterMood !== 'all') {
      result = result.filter(e => e.mood === filterMood)
    }

    // Search by title or content
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(e =>
        e.title?.toLowerCase().includes(q) ||
        e.content?.toLowerCase().includes(q)
      )
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    } else if (sortBy === 'a-z') {
      result.sort((a, b) => a.title?.localeCompare(b.title))
    }

    return result
  },

  setSearch: (q) => set({ searchQuery: q }),
  setSort: (s) => set({ sortBy: s }),
  setFilterMood: (m) => set({ filterMood: m }),
}))