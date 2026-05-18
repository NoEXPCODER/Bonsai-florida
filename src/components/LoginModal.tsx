'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth, useMessages } from '@/lib/i18n'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { isLoggedIn, login, logout } = useAuth()
  const m = useMessages()
  const t = m.auth

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const usernameRef = useRef<HTMLInputElement>(null)

  // Focus username field when modal opens (if not already logged in)
  useEffect(() => {
    if (isOpen && !isLoggedIn) {
      setTimeout(() => usernameRef.current?.focus(), 50)
    }
  }, [isOpen, isLoggedIn])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Small delay so the button state is visible
    setTimeout(() => {
      const ok = login(username, password)
      if (!ok) {
        setError(t.errorMessage)
        setPassword('')
      } else {
        setUsername('')
        setPassword('')
        onClose()
      }
      setLoading(false)
    }, 400)
  }

  function handleLogout() {
    logout()
    onClose()
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative w-full max-w-sm bg-cream-light rounded-3xl shadow-card-lg border border-forest/15 overflow-hidden">
        {/* Top pink rule */}
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />

        <div className="p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-ink-light hover:bg-forest/8 transition-colors"
            aria-label="Close login modal"
          >
            ✕
          </button>

          {/* Logo mark */}
          <div className="w-12 h-12 rounded-full border-2 border-forest flex items-center justify-center text-2xl bg-white mb-5 mx-auto">
            🌸
          </div>

          {isLoggedIn ? (
            /* ── Logged-in state ── */
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-sage-pale border border-sage/30 rounded-full px-4 py-1.5 mb-4">
                <span className="text-sm">🇻🇳</span>
                <span className="font-sans text-xs font-semibold text-forest tracking-wider">
                  {t.loggedInLabel}
                </span>
              </div>
              <h2 id="login-modal-title" className="font-serif text-2xl text-forest mb-1">
                {t.loggedInLabel}
              </h2>
              <p className="font-sans text-sm text-ink-light mb-7">{t.loggedInSub}</p>
              <button
                onClick={handleLogout}
                className="btn-secondary w-full justify-center text-sm"
              >
                {m.nav.logout}
              </button>
            </div>
          ) : (
            /* ── Login form ── */
            <>
              <h2
                id="login-modal-title"
                className="font-serif text-2xl text-forest text-center mb-1"
              >
                {t.modalTitle}
              </h2>
              <p className="font-sans text-sm text-ink-light text-center mb-6">
                {t.modalSubtitle}
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label htmlFor="login-username" className="sr-only">
                    {t.usernamePlaceholder}
                  </label>
                  <input
                    ref={usernameRef}
                    id="login-username"
                    type="text"
                    autoComplete="username"
                    placeholder={t.usernamePlaceholder}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-5 py-3.5 rounded-2xl border border-forest/20 bg-white font-sans text-base text-ink placeholder-ink-light/60 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition"
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="sr-only">
                    {t.passwordPlaceholder}
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder={t.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-5 py-3.5 rounded-2xl border border-forest/20 bg-white font-sans text-base text-ink placeholder-ink-light/60 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition"
                  />
                </div>

                {error && (
                  <p role="alert" className="font-sans text-sm text-bonsai-pink text-center">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? t.loggingIn : t.loginButton}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Bottom pink rule */}
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-bonsai-pink to-transparent" />
      </div>
    </div>
  )
}
