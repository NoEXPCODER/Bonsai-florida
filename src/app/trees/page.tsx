import { supabase } from '@/lib/supabase'
import { createServerClient } from '@/lib/supabase-server'
import TreesClient from './TreesClient'

export const dynamic = 'force-dynamic'

export default async function TreesPage() {
  const { data: trees } = await supabase
    .from('bonsai_trees')
    .select('*, tree_species(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  let logoUrl: string | null = null
  try {
    const db = createServerClient()
    const { data } = await db
      .from('site_settings')
      .select('value')
      .eq('key', 'logo_url')
      .maybeSingle()
    logoUrl = data?.value ?? null
  } catch {
    logoUrl = null
  }

  return <TreesClient trees={trees ?? []} logoUrl={logoUrl} />
}
