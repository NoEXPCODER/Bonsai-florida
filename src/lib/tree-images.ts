import type { DbTree } from '@/lib/supabase'

export const SUPABASE_URL = 'https://kezvvfocbpbyykgeohsw.supabase.co'
export const TREE_IMAGE_BUCKET = 'bonsai-trees'

function isLocalHostname(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

export function isPermanentTreeImageUrl(value: string | null | undefined): value is string {
  if (!value) return false
  const url = value.trim()
  if (!url) return false
  if (url.startsWith('/public/uploads') || url.startsWith('public/uploads')) return false
  if (url.startsWith('blob:') || url.startsWith('file:')) return false

  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return false
    if (isLocalHostname(parsed.hostname)) return false
    return true
  } catch {
    return false
  }
}

export function getTreeImageUrls(tree: Pick<DbTree, 'image_url' | 'image_urls'>): string[] {
  const candidates = [
    tree.image_url,
    ...(Array.isArray(tree.image_urls) ? tree.image_urls : []),
  ]

  return Array.from(new Set(candidates.filter(isPermanentTreeImageUrl)))
}

export function getPrimaryTreeImageUrl(tree: Pick<DbTree, 'image_url' | 'image_urls'>): string | null {
  return getTreeImageUrls(tree)[0] ?? null
}

export function getTreeStoragePaths(tree: Pick<DbTree, 'image_url' | 'image_urls'>): string[] {
  return getTreeImageUrls(tree)
    .map(getSupabaseStoragePath)
    .filter((path): path is string => path !== null)
}

export function getSupabaseStoragePath(value: string): string | null {
  if (!isPermanentTreeImageUrl(value)) return null

  try {
    const parsed = new URL(value)
    const expectedOrigin = new URL(SUPABASE_URL).origin
    if (parsed.origin !== expectedOrigin) return null

    const publicPrefix = `/storage/v1/object/public/${TREE_IMAGE_BUCKET}/`
    const signedPrefix = `/storage/v1/object/sign/${TREE_IMAGE_BUCKET}/`
    const prefix = parsed.pathname.startsWith(publicPrefix)
      ? publicPrefix
      : parsed.pathname.startsWith(signedPrefix)
        ? signedPrefix
        : null

    if (!prefix) return null

    const path = decodeURIComponent(parsed.pathname.slice(prefix.length))
    return path && !path.startsWith('/') ? path : null
  } catch {
    return null
  }
}
