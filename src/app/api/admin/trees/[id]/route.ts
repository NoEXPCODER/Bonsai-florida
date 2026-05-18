import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { validateSession, COOKIE_NAME } from '@/lib/session'
import { getTreeStoragePaths, TREE_IMAGE_BUCKET } from '@/lib/tree-images'

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

/** DELETE /api/admin/trees/[id] — soft-delete (mark inactive) */
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = createServerClient()

  const { data: tree, error: fetchError } = await db
    .from('bonsai_trees')
    .select('image_url, image_urls')
    .eq('id', id)
    .maybeSingle()

  if (fetchError) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const { error } = await db
    .from('bonsai_trees')
    .update({ is_active: false })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const imagePaths = tree ? getTreeStoragePaths(tree) : []
  let cleanupError: string | null = null

  if (imagePaths.length > 0) {
    const { error: removeError } = await db.storage
      .from(TREE_IMAGE_BUCKET)
      .remove(imagePaths)

    if (removeError) {
      cleanupError = 'Some uploaded images could not be deleted.'
      console.error(`Tree ${id} image cleanup failed: ${removeError.message}`)
    }
  }

  return NextResponse.json({ ok: true, cleanupError })
}
