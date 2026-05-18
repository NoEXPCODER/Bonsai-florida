import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const db = createServerClient()
    const { data, error } = await db
      .from('bonsai_trees')
      .select('id, name, species, price, image_url, image_urls, sold_image_url, sold_note, sold_at, tree_code')
      .eq('is_active', false)
      .not('sold_at', 'is', null)
      .order('sold_at', { ascending: false })
      .limit(3)

    if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 })

    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
