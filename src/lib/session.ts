import { createHash, randomBytes } from 'crypto'
import { createServerClient } from '@/lib/supabase-server'

export const COOKIE_NAME = 'bf_staff'
export const REMEMBER_DAYS = 30

export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function getDeviceName(ua: string): string {
  if (!ua) return 'Unknown Device'
  if (/iPhone/i.test(ua)) return 'iPhone'
  if (/iPad/i.test(ua)) return 'iPad'
  if (/Android/i.test(ua)) return /Mobile/i.test(ua) ? 'Android Phone' : 'Android Tablet'
  if (/Macintosh/i.test(ua)) return 'Mac'
  if (/Windows/i.test(ua)) return 'Windows PC'
  if (/Linux/i.test(ua)) return 'Linux'
  return 'Unknown Device'
}

export interface StaffSession {
  id: string
  device_name: string
}

/** Validate a raw cookie token. Returns the session row or null. */
export async function validateSession(rawToken: string | undefined): Promise<StaffSession | null> {
  if (!rawToken) return null
  try {
    const db = createServerClient()
    const hash = hashToken(rawToken)
    const now = new Date().toISOString()

    const { data } = await db
      .from('staff_sessions')
      .select('id, device_name')
      .eq('token_hash', hash)
      .is('revoked_at', null)
      .gt('expires_at', now)
      .maybeSingle()

    if (data) {
      // Update last_used_at (fire-and-forget)
      db.from('staff_sessions')
        .update({ last_used_at: now })
        .eq('id', data.id)
        .then(() => {})
    }

    return data ?? null
  } catch {
    return null
  }
}
