'use client'

import { createContext, useContext, useState } from 'react'
import { en } from '@/messages/en'
import { vi } from '@/messages/vi'

type Locale = 'en' | 'vi'

interface LocaleContextValue {
  locale: Locale
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')
  function toggleLocale() { setLocale(l => l === 'en' ? 'vi' : 'en') }
  return (
    <LocaleContext.Provider value={{ locale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

/** Returns the full message object for the active locale. */
export function useMessages() {
  const { locale } = useAuth()
  return locale === 'vi' ? vi : en
}
