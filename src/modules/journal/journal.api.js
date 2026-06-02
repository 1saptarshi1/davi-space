import { supabase } from '../../lib/supabase'

// Get all entries for current user
export const fetchEntries = async (userId) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Add new entry
export const addEntry = async (entry) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert([entry])
    .select()
    .single()

  return { data, error }
}

// Update entry
export const updateEntry = async (id, updates) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

// Delete entry
export const deleteEntry = async (id) => {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id)

  return { error }
}