import { supabase } from './supabase'

type Metadata = Record<string, unknown>

export async function track(event_name: string, metadata: Metadata = {}, source: 'marketing'|'admin'|'app' = 'admin') {
  try {
    const { data: u } = await supabase.auth.getUser()
    await supabase.from('events').insert({ event_name, metadata, source, actor_user_id: u.user?.id ?? null })
  } catch {
    // ignore
  }
}
