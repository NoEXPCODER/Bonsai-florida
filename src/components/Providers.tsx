'use client'

import { AuthProvider } from '@/lib/i18n'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
