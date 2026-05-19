'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { en } from '@/messages/en'
import { vi } from '@/messages/vi'
import type { Customer } from '@/lib/customer-session'
import { getCustomer } from '@/lib/customer-session'

type Locale = 'en' | 'vi'

interface LocaleContextValue {
  locale: Locale
  toggleLocale: () => void
  customer: Customer | null
  setCustomer: (c: Customer | null) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')
  const [customer, setCustomerState] = useState<Customer | null>(null)

  useEffect(() => {
    setCustomerState(getCustomer())
  }, [])

  function toggleLocale() {
    setLocale(l => (l === 'en' ? 'vi' : 'en'))
  }

  function setCustomer(c: Customer | null) {
    setCustomerState(c)
  }

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale, customer, setCustomer }}>
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
