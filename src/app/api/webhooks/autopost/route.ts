import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { makeSpeciesSlug } from '@/lib/species'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bonsaiflorida.com'

function fmt(price: string | null): string {
  const p = (price ?? '').trim()
  return p.startsWith('$') ? p : `$${p}`
}

export async function POST(req: NextRequest) {
  const secret = process.env.N8N_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })

  const auth = req.headers.get('authorization') ?? ''
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { tree_code?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { tree_code } = body
  if (!tree_code) return NextResponse.json({ error: 'tree_code required' }, { status: 400 })

  const db = createServerClient()
  const { data: tree, error } = await db
    .from('bonsai_trees')
    .select('*, tree_species:species_id(*)')
    .eq('tree_code', tree_code)
    .eq('is_active', true)
    .single()

  if (error || !tree) return NextResponse.json({ error: 'Tree not found' }, { status: 404 })

  const species = tree.tree_species ?? null
  const treeUrl = `${SITE}/tree/${tree.tree_code}`
  const careGuideUrl = species ? `${SITE}/care-guides/${makeSpeciesSlug(species)}` : null
  const speciesTag = tree.species
    ? '#' + (tree.species as string).split(' ')[0].replace(/[^a-zA-Z]/g, '') + 'Bonsai'
    : species?.name_en
      ? '#' + (species.name_en as string).split(' ')[0].replace(/[^a-zA-Z]/g, '') + 'Bonsai'
      : ''
  const levelBlurb = tree.level === 'Beginner Friendly'
    ? 'A perfect starter bonsai — low-maintenance and thrives in South Florida.'
    : 'A beautiful piece for the experienced collector.'

  const text = [
    `🌿 ${tree.name} — ${fmt(tree.price)}`,
    ...(tree.species ? [tree.species] : []),
    '',
    `🌱 ${tree.level}`,
    `☀️ Sun: ${tree.sun}`,
    `💧 Water: ${tree.water}`,
    '',
    levelBlurb,
    '',
    `Available at Bonsai Florida · Palm Beach, FL`,
    `Text to inquire: 561-312-9576`,
    '',
    `👉 View tree: ${treeUrl}`,
    ...(careGuideUrl ? [`📖 Care guide: ${careGuideUrl}`] : []),
    '',
    `#BonsaiFlorida${speciesTag ? ' ' + speciesTag : ''} #Bonsai #TropicalBonsai #PalmBeach #Florida`,
  ].join('\n')

  return NextResponse.json({
    text,
    imageUrl: tree.image_url ?? null,
    treeUrl,
    careGuideUrl,
    hashtags: `#BonsaiFlorida${speciesTag ? ' ' + speciesTag : ''} #Bonsai #TropicalBonsai #PalmBeach #Florida`,
    tree,
  })
}
