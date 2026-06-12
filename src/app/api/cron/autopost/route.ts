import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bonsaiflorida.com'
const PHONE = '561-312-9576'

type PostFormat = 'new_arrival' | 'daily_spotlight' | 'weekly_collection' | 'leftover_push'

function fmt(price: string | null): string {
  const p = (price ?? '').trim()
  return p.startsWith('$') ? p : `$${p}`
}

// ─── Post text builders ───────────────────────────────────────────────────────

function speciesTag(tree: Record<string, string | null>): string {
  const s = (tree.species ?? '') as string
  return s ? '#' + s.split(' ')[0].replace(/[^a-zA-Z]/g, '') + 'Bonsai' : ''
}

function treeUrl(code: string) {
  return `${SITE}/tree/${code}`
}

function buildNewArrival(tree: Record<string, string | null>): string {
  const tag = speciesTag(tree)
  const url = treeUrl(tree.tree_code as string)
  const levelBlurb = tree.level === 'Beginner Friendly'
    ? 'Perfect for beginners — easy care and loves South Florida weather.'
    : 'A statement piece for the experienced collector.'
  return [
    `🆕 Just added — ${tree.name}!`,
    ``,
    `${fmt(tree.price)}${tree.species ? ` · ${tree.species}` : ''}`,
    `🌱 ${tree.level}`,
    `☀️ ${tree.sun}`,
    `💧 ${tree.water}`,
    ``,
    levelBlurb,
    ``,
    `Text to reserve: ${PHONE}`,
    `👉 ${url}`,
    ``,
    `#BonsaiFlorida${tag ? ' ' + tag : ''} #NewArrival #Bonsai #TropicalBonsai #PalmBeach #Florida`,
  ].join('\n')
}

function buildDailySpotlight(tree: Record<string, string | null>): string {
  const tag = speciesTag(tree)
  const url = treeUrl(tree.tree_code as string)
  const levelBlurb = tree.level === 'Beginner Friendly'
    ? 'A perfect starter bonsai — low-maintenance and thrives in South Florida.'
    : 'A beautiful piece for the experienced collector.'
  return [
    `🌿 ${tree.name} — ${fmt(tree.price)}`,
    ...(tree.species ? [tree.species] : []),
    ``,
    `🌱 ${tree.level}`,
    `☀️ Sun: ${tree.sun}`,
    `💧 Water: ${tree.water}`,
    ``,
    levelBlurb,
    ``,
    `Available at Bonsai Florida · Palm Beach, FL`,
    `Text to inquire: ${PHONE}`,
    ``,
    `👉 ${url}`,
    ``,
    `#BonsaiFlorida${tag ? ' ' + tag : ''} #Bonsai #TropicalBonsai #PalmBeach #Florida`,
  ].join('\n')
}

function buildWeeklyCollection(trees: Record<string, string | null>[]): string {
  const lines = trees.map(t => `🌿 ${t.name} — ${fmt(t.price)}`)
  return [
    `🌳 This week at Bonsai Florida`,
    ``,
    ...lines,
    ``,
    `All available for garden visits in the Palm Beach area.`,
    `Text to schedule: ${PHONE}`,
    ``,
    `👉 See all trees: ${SITE}/trees`,
    ``,
    `#BonsaiFlorida #Bonsai #TropicalBonsai #PalmBeach #FloridaBonsai #BonsaiCollection`,
  ].join('\n')
}

function buildLeftoverPush(tree: Record<string, string | null>): string {
  const tag = speciesTag(tree)
  const url = treeUrl(tree.tree_code as string)
  const days = Math.floor((Date.now() - new Date(tree.created_at as string).getTime()) / 86400000)
  const timeLabel = days > 13 ? `${Math.floor(days / 7)} weeks` : `${days} days`
  const levelBlurb = tree.level === 'Beginner Friendly'
    ? 'Easy care, great for beginners or as a gift.'
    : 'A collector\'s piece still looking for the right home.'
  return [
    `⏳ Still available — ${tree.name}`,
    ``,
    `${fmt(tree.price)}${tree.species ? ` · ${tree.species}` : ''}`,
    `In our collection for ${timeLabel}.`,
    ``,
    levelBlurb,
    ``,
    `Text if interested: ${PHONE}`,
    `👉 ${url}`,
    ``,
    `#BonsaiFlorida${tag ? ' ' + tag : ''} #StillAvailable #Bonsai #TropicalBonsai #PalmBeach`,
  ].join('\n')
}

// ─── Tree selection ───────────────────────────────────────────────────────────

// Returns the most recent posted_at for each tree_id from the log
async function getLastPostDates(db: ReturnType<typeof createServerClient>, treeIds: string[]): Promise<Map<string, Date>> {
  if (!treeIds.length) return new Map()
  const { data } = await db
    .from('tree_post_log')
    .select('tree_id, posted_at')
    .in('tree_id', treeIds)
    .order('posted_at', { ascending: false })

  const map = new Map<string, Date>()
  for (const row of data ?? []) {
    if (row.tree_id && !map.has(row.tree_id)) {
      map.set(row.tree_id, new Date(row.posted_at))
    }
  }
  return map
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Auth: Vercel sends Authorization: Bearer CRON_SECRET automatically
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.get('authorization') ?? ''
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const n8nUrl = process.env.N8N_CRON_WEBHOOK_URL
  if (!n8nUrl) return NextResponse.json({ error: 'N8N_CRON_WEBHOOK_URL not configured' }, { status: 503 })

  const db = createServerClient()

  // Get all postable active trees (must have image + tree_code)
  const { data: allTrees, error } = await db
    .from('bonsai_trees')
    .select('id, tree_code, name, species, price, level, sun, water, image_url, created_at, status')
    .eq('is_active', true)
    .eq('status', 'active')
    .not('tree_code', 'is', null)
    .not('image_url', 'is', null)

  if (error || !allTrees?.length) {
    return NextResponse.json({ ok: true, message: 'No postable trees found' })
  }

  const now = new Date()
  // Determine day of week in Florida (Eastern time)
  const easternNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
  const dayOfWeek = easternNow.getDay() // 0=Sun, 6=Sat

  const treeIds = allTrees.map(t => t.id)
  const lastPosted = await getLastPostDates(db, treeIds)

  const sevenDaysAgo  = new Date(now.getTime() - 7  * 86400000)
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000)
  const twentyOneDaysAgo = new Date(now.getTime() - 21 * 86400000)

  // Determine format and select trees
  let format: PostFormat
  let selectedTrees: typeof allTrees = []

  if (dayOfWeek === 0) {
    // Sunday: leftover push — trees in inventory >21 days, not posted in last 14 days
    format = 'leftover_push'
    const candidates = allTrees
      .filter(t => new Date(t.created_at) < twentyOneDaysAgo)
      .filter(t => {
        const lp = lastPosted.get(t.id)
        return !lp || lp < fourteenDaysAgo
      })
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    selectedTrees = candidates.slice(0, 1)

  } else if (dayOfWeek === 6) {
    // Saturday: weekly collection — 4–6 trees not posted in last 7 days
    format = 'weekly_collection'
    const candidates = allTrees
      .filter(t => {
        const lp = lastPosted.get(t.id)
        return !lp || lp < sevenDaysAgo
      })
      .sort((a, b) => {
        // Prioritise never-posted, then least-recently-posted
        const aDate = lastPosted.get(a.id)?.getTime() ?? 0
        const bDate = lastPosted.get(b.id)?.getTime() ?? 0
        return aDate - bDate
      })
    selectedTrees = candidates.slice(0, 6)

  } else {
    // Mon–Fri: new arrival if available, otherwise daily spotlight
    const newArrivals = allTrees.filter(t => {
      const addedRecently = new Date(t.created_at) > sevenDaysAgo
      const neverPosted = !lastPosted.has(t.id)
      return addedRecently && neverPosted
    })

    if (newArrivals.length > 0) {
      format = 'new_arrival'
      // Pick the newest one
      selectedTrees = [newArrivals.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0]]
    } else {
      format = 'daily_spotlight'
      // Pick the tree least recently posted (never-posted first)
      const candidates = [...allTrees].sort((a, b) => {
        const aDate = lastPosted.get(a.id)?.getTime() ?? 0
        const bDate = lastPosted.get(b.id)?.getTime() ?? 0
        return aDate - bDate
      })
      selectedTrees = candidates.slice(0, 1)
    }
  }

  if (!selectedTrees.length) {
    return NextResponse.json({ ok: true, message: `No trees matched for format: ${format}` })
  }

  // Build post text
  const trees = selectedTrees as unknown as Record<string, string | null>[]
  let postText: string
  if (format === 'new_arrival')       postText = buildNewArrival(trees[0])
  else if (format === 'leftover_push') postText = buildLeftoverPush(trees[0])
  else if (format === 'weekly_collection') postText = buildWeeklyCollection(trees)
  else                                postText = buildDailySpotlight(trees[0])

  // Send to n8n
  const payload = {
    format,
    post_text: postText,
    trees: trees.map(t => ({
      id: t.id,
      tree_code: t.tree_code,
      name: t.name,
      species: t.species,
      price: t.price,
      level: t.level,
      sun: t.sun,
      water: t.water,
      image_url: t.image_url,
      tree_url: t.tree_code ? treeUrl(t.tree_code) : null,
    })),
  }

  const n8nRes = await fetch(n8nUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!n8nRes.ok) {
    return NextResponse.json({ error: `n8n returned ${n8nRes.status}` }, { status: 502 })
  }

  // Log each tree
  if (format === 'weekly_collection') {
    // One log entry for the collection, then link each tree
    const { data: logEntry } = await db
      .from('tree_post_log')
      .insert({ tree_id: null, format, post_text: postText, triggered_by: 'cron' })
      .select('id')
      .single()

    if (logEntry?.id) {
      await db.from('tree_post_log_trees').insert(
        selectedTrees.map(t => ({ log_id: logEntry.id, tree_id: t.id }))
      )
    }
  } else {
    await db.from('tree_post_log').insert({
      tree_id: selectedTrees[0].id,
      format,
      post_text: postText,
      image_url: selectedTrees[0].image_url ?? null,
      tree_url: selectedTrees[0].tree_code ? treeUrl(selectedTrees[0].tree_code) : null,
      triggered_by: 'cron',
    })
  }

  return NextResponse.json({
    ok: true,
    format,
    trees: selectedTrees.map(t => t.name),
    preview: postText.slice(0, 120) + '…',
  })
}
