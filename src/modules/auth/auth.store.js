import { create } from 'zustand'
import { supabase } from '../../lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  // Call this once on app start
  init: async () => {
    const { data } = await supabase.auth.getSession()
    set({ user: data.session?.user ?? null, loading: false })

    // Listen for login/logout changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null })
    })
  },

  // Sign up with email + password
  signUp: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    })
    return { data, error }
  },

  // Login
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Logout
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  }
}))