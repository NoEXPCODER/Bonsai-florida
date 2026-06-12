import 'server-only'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kezvvfocbpbyykgeohsw.supabase.co'

/** Server-only client using the service role key — bypasses RLS. Never import this in client components. */
export function createServerClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY env var is not set.')
  return createClient(SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
