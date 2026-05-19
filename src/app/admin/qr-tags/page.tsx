import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { validateSession, COOKIE_NAME } from '@/lib/session'
import { createServerClient } from '@/lib/supabase-server'
import QrTagsClient from './QrTagsClient'

export const dynamic = 'force-dynamic'

export default async function QrTagsPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  const store = await cookies()
  const rawToken = store.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)
  if (!session) redirect('/admin')

  const { ids } = await searchParams
  const treeIds = (ids ?? '').split(',').map(s => s.trim()).filter(Boolean)
  if (treeIds.length === 0) redirect('/admin')

  const db = createServerClient()
  const { data: trees } = await db
    .from('bonsai_trees')
    .select('id, name, tree_code, image_url, species')
    .in('id', treeIds)
    .eq('is_active', true)

  // Preserve the order from the URL
  const ordered = treeIds
    .map(id => (trees ?? []).find(t => t.id === id))
    .filter((t): t is NonNullable<typeof t> => t != null)

  if (ordered.length === 0) redirect('/admin')

  return <QrTagsClient trees={ordered} />
}
