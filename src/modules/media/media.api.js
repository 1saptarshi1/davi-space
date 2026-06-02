import { supabase } from '../../lib/supabase'

export const fetchMedia = async (userId) => {
  const { data, error } = await supabase
    .from('media_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const addMedia = async (item) => {
  const { data, error } = await supabase
    .from('media_items')
    .insert([item])
    .select()
    .single()
  return { data, error }
}

export const toggleFavorite = async (id, current) => {
  const { data, error } = await supabase
    .from('media_items')
    .update({ favorite: !current })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export const deleteMedia = async (id) => {
  const { error } = await supabase
    .from('media_items')
    .delete()
    .eq('id', id)
  return { error }
}