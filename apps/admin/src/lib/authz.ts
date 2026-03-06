import { supabase } from './supabase'

export async function isAdmin(): Promise<boolean> {
  const { data: userRes } = await supabase.auth.getUser()
  const userId = userRes.user?.id
  if (!userId) return false

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', userId)
    .single()

  if (error) return false
  return data?.role === 'admin'
}
