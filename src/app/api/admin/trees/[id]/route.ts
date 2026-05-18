import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { validateSession, COOKIE_NAME } from '@/lib/session'

type Params = Promise<{ id: string }>

/** PATCH /api/admin/trees/[id] — update tree fields */
export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const db = createServerClient()

  const { error } = await db
    .from('bonsai_trees')
    .update({
      ...(body.name !== undefined && { name: body.name }),
      ...(body.species !== undefined && { species: body.species }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.level !== undefined && { level: body.level }),
      ...(body.sun !== undefined && { sun: body.sun }),
      ...(body.water !== undefined && { water: body.water }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.image_url !== undefined && { image_url: body.image_url }),
      ...(body.image_urls !== undefined && { image_urls: body.image_urls }),
      ...(body.location_row !== undefined && { location_row: body.location_row || null }),
      ...(body.location_tree !== undefined && { location_tree: body.location_tree || null }),
      ...(body.species_id !== undefined && { species_id: body.species_id || null }),
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

/** DELETE /api/admin/trees/[id] — mark sold by moving it out of active inventory */
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const db = createServerClient()

  const { error } = await db
    .from('bonsai_trees')
    .update({
      is_active: false,
      sold_image_url: body.sold_image_url || null,
      sold_note: body.sold_note || null,
      sold_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
