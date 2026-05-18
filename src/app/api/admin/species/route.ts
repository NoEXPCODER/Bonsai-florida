import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { validateSession, COOKIE_NAME } from '@/lib/session'

/** GET /api/admin/species — public, returns all species */
export async function GET() {
  const db = createServerClient()
  const { data, error } = await db
    .from('tree_species')
    .select('*')
    .order('name_en')
  if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 })
  return NextResponse.json(data)
}

/** POST /api/admin/species — create new species (staff only) */
export async function POST(req: NextRequest) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db = createServerClient()
  const { data, error } = await db
    .from('tree_species')
    .insert({
      name_en: body.name_en,
      name_vi: body.name_vi || '',
      species_latin: body.species_latin || '',
      level: body.level || 'Beginner Friendly',
      sun_en: body.sun_en || '',
      sun_vi: body.sun_vi || '',
      water_en: body.water_en || '',
      water_vi: body.water_vi || '',
      care_en: body.care_en || '',
      care_vi: body.care_vi || '',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 })
  return NextResponse.json(data)
}
