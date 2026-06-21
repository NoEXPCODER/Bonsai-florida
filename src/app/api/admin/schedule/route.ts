import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { validateSession, COOKIE_NAME } from '@/lib/session'

export async function GET(req: NextRequest) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServerClient()

  // Last 30 posts
  const { data: history } = await db
    .from('tree_post_log')
    .select('id, tree_id, format, post_text, image_url, tree_url, triggered_by, posted_at')
    .order('posted_at', { ascending: false })
    .limit(30)

  // Get tree names for history entries that have a tree_id
  const treeIds = [...new Set((history ?? []).map(h => h.tree_id).filter(Boolean))] as string[]
  const treeNames: Record<string, string> = {}
  if (treeIds.length) {
    const { data: treeRows } = await db
      .from('bonsai_trees')
      .select('id, name, tree_code')
      .in('id', treeIds)
    for (const t of treeRows ?? []) treeNames[t.id] = t.name
  }

  // Determine today's format (Eastern time)
  const easternNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))
  const dayOfWeek = easternNow.getDay()
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const FORMAT_INFO: Record<string, { label: string; description: string; emoji: string }> = {
    new_arrival:       { emoji: '🆕', label: 'New Arrival',       description: 'Newest tree added this week, never posted before' },
    daily_spotlight:   { emoji: '🌿', label: 'Daily Spotlight',   description: 'One tree featured with full care details' },
    weekly_collection: { emoji: '🌳', label: 'Weekly Collection', description: '4–6 trees in one post to show the full range' },
    leftover_push:     { emoji: '⏳', label: 'Leftover Push',     description: 'Trees in inventory 21+ days, still looking for a home' },
  }

  let todayFormat: string
  if (dayOfWeek === 0) todayFormat = 'leftover_push'
  else if (dayOfWeek === 6) todayFormat = 'weekly_collection'
  else todayFormat = 'new_arrival' // may fall back to daily_spotlight at cron time

  return NextResponse.json({
    todayFormat,
    todayFormatInfo: FORMAT_INFO[todayFormat],
    todayDay: dayNames[dayOfWeek],
    cronTime: '12:00 PM Eastern (noon)',
    history: (history ?? []).map(h => ({
      ...h,
      treeName: h.tree_id ? (treeNames[h.tree_id] ?? 'Unknown') : null,
    })),
    formatInfo: FORMAT_INFO,
    schedule: [
      { day: 'Monday – Friday', format: 'new_arrival / daily_spotlight', emoji: '🌿', note: 'New arrival first, then daily rotation' },
      { day: 'Saturday',        format: 'weekly_collection',              emoji: '🌳', note: '4–6 trees in one post' },
      { day: 'Sunday',          format: 'leftover_push',                  emoji: '⏳', note: 'Trees 21+ days in inventory' },
    ],
  })
}
