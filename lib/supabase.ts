import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

// ── Types générés manuellement (sync avec la migration) ───────────────────────

export interface DbComment {
  id: string
  text: string
  route: string
  route_label: string
  panel_id: string | null
  panel_label: string | null
  created_at: string
  ip: string | null
  user_agent: string | null
}
