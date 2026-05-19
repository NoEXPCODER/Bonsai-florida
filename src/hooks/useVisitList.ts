import { useState, useEffect, useCallback } from 'react'
import {
  getVisitList, addToVisitList, removeFromVisitList, isInVisitList,
  VISIT_LIST_EVENT, type VisitItem,
} from '@/lib/visit-list'

export function useVisitList() {
  const [list, setList] = useState<VisitItem[]>([])

  useEffect(() => {
    setList(getVisitList())
    function sync() { setList(getVisitList()) }
    window.addEventListener(VISIT_LIST_EVENT, sync)
    return () => window.removeEventListener(VISIT_LIST_EVENT, sync)
  }, [])

  const toggle = useCallback((item: VisitItem) => {
    if (isInVisitList(item.id)) {
      removeFromVisitList(item.id)
    } else {
      addToVisitList(item)
    }
    setList(getVisitList())
  }, [])

  const remove = useCallback((id: string) => {
    removeFromVisitList(id)
    setList(getVisitList())
  }, [])

  return { list, toggle, remove, count: list.length }
}
