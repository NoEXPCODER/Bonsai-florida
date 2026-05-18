import { supabase } from '@/lib/supabase'
import TreesClient from './TreesClient'

export const dynamic = 'force-dynamic'

export default async function TreesPage() {
  const { data: trees } = await supabase
    .from('bonsai_trees')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return <TreesClient trees={trees ?? []} />
}
