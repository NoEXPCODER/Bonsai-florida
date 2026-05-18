import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { validateSession, COOKIE_NAME } from '@/lib/session'

/** POST /api/admin/trees — create a tree (server-side auth required) */
export async function POST(req: NextRequest) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db = createServerClient()

  const { data, error } = await db
    .from('bonsai_trees')
    .insert({
      name: body.name || 'Bonsai Tree',
      species: body.species || null,
      price: body.price || 'Call for price',
      level: body.level || 'Beginner Friendly',
      sun: body.sun || 'Bright indirect light',
      water: body.water || 'Every 2–3 days',
      notes: body.notes || null,
      image_url: body.image_url || null,
      image_urls: body.image_urls || [],
      location_row: body.location_row || null,
      location_tree: body.location_tree || null,
      species_id: body.species_id || null,
    })
    .select('id, tree_code')
    .single()

  if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 })
  return NextResponse.json({ ok: true, id: data.id, tree_code: data.tree_code })
}
