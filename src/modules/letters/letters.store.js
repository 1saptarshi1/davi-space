import { create } from 'zustand'
import { fetchLetters, addLetter, deleteLetter } from './letters.api'

export const useLettersStore = create((set) => ({
  letters: [],
  loading: false,

  loadLetters: async (userId) => {
    set({ loading: true })
    const { data } = await fetchLetters(userId)
    set({ letters: data || [], loading: false })
  },

  addLetter: async (letter) => {
    const { data, error } = await addLetter(letter)
    if (!error && data) {
      set(state => ({ letters: [data, ...state.letters] }))
    }
    return { error }
  },

  deleteLetter: async (id) => {
    const { error } = await deleteLetter(id)
    if (!error) {
      set(state => ({
        letters: state.letters.filter(l => l.id !== id)
      }))
    }
    return { error }
  }
}))