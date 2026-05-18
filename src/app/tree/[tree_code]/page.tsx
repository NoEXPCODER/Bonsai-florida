import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { validateSession } from '@/lib/session'
import { supabase as anonClient } from '@/lib/supabase'
import TreePageClient from './TreePageClient'

export const dynamic = 'force-dynamic'

export default async function TreePage({
  params,
}: {
  params: Promise<{ tree_code: string }>
}) {
  const { tree_code } = await params

  // Fetch tree (use anon client — public read)
  const { data: tree } = await anonClient
    .from('bonsai_trees')
    .select('*')
    .eq('tree_code', tree_code.toUpperCase())
    .eq('is_active', true)
    .maybeSingle()

  if (!tree) notFound()

  // Fetch linked species for care guide (if any)
  const { data: species } = tree.species_id
    ? await anonClient.from('tree_species').select('*').eq('id', tree.species_id).maybeSingle()
    : { data: null }

  // Check staff session
  const store = await cookies()
  const rawToken = store.get('bf_staff')?.value
  const session = await validateSession(rawToken)

  return <TreePageClient tree={tree} isStaff={session !== null} species={species} />
}
