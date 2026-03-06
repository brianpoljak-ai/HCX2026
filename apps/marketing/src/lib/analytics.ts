import { supabase } from './supabase'

type Metadata = Record<string, unknown>

export async function track(event_name: string, metadata: Metadata = {}, source: 'marketing'|'admin'|'app' = 'marketing') {
  try {
    await supabase.from('events').insert({ event_name, metadata, source })
  } catch {
    // Swallow analytics errors; never block UX.
  }
}
