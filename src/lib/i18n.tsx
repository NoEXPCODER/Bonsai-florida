'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AUTH } from '@/config/auth'
import { en } from '@/messages/en'
import { vi } from '@/messages/vi'

type Locale = 'en' | 'vi'

interface AuthContextValue {
  locale: Locale
  isLoggedIn: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'bf_owner_session'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Restore session from localStorage on first mount
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === '1') {
      setLocale('vi')
      setIsLoggedIn(true)
    }
  }, [])

  function login(username: string, password: string): boolean {
    const ok = username.trim() === AUTH.username && password === AUTH.password
    if (ok) {
      setLocale('vi')
      setIsLoggedIn(true)
      localStorage.setItem(STORAGE_KEY, '1')
    }
    return ok
  }

  function logout() {
    setLocale('en')
    setIsLoggedIn(false)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ locale, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

/** Returns the full message object for the active locale. */
export function useMessages() {
  const { locale } = useAuth()
  return locale === 'vi' ? vi : en
}
