import { supabase } from '../../lib/supabase'

// Upload image to Supabase Storage
export const uploadImage = async (file, userId) => {
  const ext = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${ext}`

  const { data, error } = await supabase.storage
    .from('memories')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) return { url: null, error }

  const { data: urlData } = supabase.storage
    .from('memories')
    .getPublicUrl(fileName)

  return { url: urlData.publicUrl, error: null }
}

// Fetch all memories
export const fetchMemories = async (userId) => {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// Add memory
export const addMemory = async (memory) => {
  const { data, error } = await supabase
    .from('memories')
    .insert([memory])
    .select()
    .single()
  return { data, error }
}

// Toggle favorite
export const toggleFavorite = async (id, current) => {
  const { data, error } = await supabase
    .from('memories')
    .update({ favorite: !current })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// Delete memory
export const deleteMemory = async (id, imageUrl) => {
  // Delete from storage
  const path = imageUrl.split('/memories/')[1]
  await supabase.storage.from('memories').remove([path])

  // Delete from table
  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('id', id)
  return { error }
}