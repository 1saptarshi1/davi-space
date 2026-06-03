import { supabase } from '../../lib/supabase'

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase.auth.updateUser({
    data: updates
  })
  return { data, error }
}

export const fetchStats = async (userId) => {
  const [journals, memories, letters, media] = await Promise.all([
    supabase.from('journal_entries').select('id', { count: 'exact' }).eq('user_id', userId),
    supabase.from('memories').select('id', { count: 'exact' }).eq('user_id', userId),
    supabase.from('letters').select('id', { count: 'exact' }).eq('user_id', userId),
    supabase.from('media_items').select('id', { count: 'exact' }).eq('user_id', userId),
  ])

  return {
    journals: journals.count || 0,
    memories: memories.count || 0,
    letters:  letters.count  || 0,
    media:    media.count    || 0,
  }
}