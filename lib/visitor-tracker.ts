import { supabase } from './supabase'

/**
 * Fetches the visitor's public IP then upserts into `visitors`.
 * Duplicate (ip, user_agent) pairs increment visit_count instead of inserting.
 * Silent no-op on network failure.
 */
export async function trackVisitor(): Promise<string | undefined> {
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const { ip } = (await res.json()) as { ip: string }
    const userAgent = navigator.userAgent
    await supabase.rpc('track_visitor', { p_ip: ip, p_user_agent: userAgent })
    return ip
  } catch {
    return undefined
  }
}
