import { supabase } from '../../lib/supabase'

export const fetchLetters = async (userId) => {
  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const addLetter = async (letter) => {
  const { data, error } = await supabase
    .from('letters')
    .insert([letter])
    .select()
    .single()
  return { data, error }
}

export const deleteLetter = async (id) => {
  const { error } = await supabase
    .from('letters')
    .delete()
    .eq('id', id)
  return { error }
}