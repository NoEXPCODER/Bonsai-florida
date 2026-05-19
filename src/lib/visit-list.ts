const KEY = 'bf_visit_list'
export const VISIT_LIST_EVENT = 'bf_visit_list_changed'
export const MAX_VISIT_LIST = 5

export interface VisitItem {
  id: string
  name: string
  price: number
  imageUrl?: string
  treeCode?: string
}

export function getVisitList(): VisitItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as VisitItem[]) : []
  } catch { return [] }
}

export function addToVisitList(item: VisitItem): VisitItem[] {
  const list = getVisitList()
  if (list.find(i => i.id === item.id) || list.length >= MAX_VISIT_LIST) return list
  const next = [...list, item]
  localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(VISIT_LIST_EVENT))
  return next
}

export function removeFromVisitList(id: string): VisitItem[] {
  const next = getVisitList().filter(i => i.id !== id)
  localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(VISIT_LIST_EVENT))
  return next
}

export function isInVisitList(id: string): boolean {
  return getVisitList().some(i => i.id === id)
}

export function clearVisitList(): void {
  localStorage.removeItem(KEY)
  window.dispatchEvent(new Event(VISIT_LIST_EVENT))
}
