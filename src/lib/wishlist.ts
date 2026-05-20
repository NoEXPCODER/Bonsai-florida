const KEY = 'bf_wishlist'

export function getWishlist(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function toggleWishlist(treeId: string): string[] {
  const list = getWishlist()
  const next = list.includes(treeId)
    ? list.filter(id => id !== treeId)
    : [...list, treeId]
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}

export function clearWishlist(): void {
  localStorage.removeItem(KEY)
}
