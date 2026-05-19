'use client'

import { usePathname } from 'next/navigation'
import StickyMobileCTA from '@/components/StickyMobileCTA'

export default function GlobalStickyBar() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin') || pathname.startsWith('/book')) return null
  return <StickyMobileCTA />
}
