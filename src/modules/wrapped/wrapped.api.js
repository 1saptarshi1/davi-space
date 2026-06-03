import { supabase } from '../../lib/supabase'

export const fetchWrappedData = async (userId) => {
  const [journals, memories, letters, media] = await Promise.all([
    supabase.from('journal_entries').select('mood, created_at').eq('user_id', userId),
    supabase.from('memories').select('created_at, favorite').eq('user_id', userId),
    supabase.from('letters').select('created_at, unlock_date').eq('user_id', userId),
    supabase.from('media_items').select('platform, created_at, favorite').eq('user_id', userId),
  ])

  return {
    journals: journals.data || [],
    memories: memories.data || [],
    letters:  letters.data  || [],
    media:    media.data    || [],
  }
}