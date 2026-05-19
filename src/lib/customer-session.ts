const KEY = 'bf_customer'

export interface Customer {
  name: string
  phone: string
}

export function getCustomer(): Customer | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Customer) : null
  } catch {
    return null
  }
}

export function saveCustomer(c: Customer): void {
  localStorage.setItem(KEY, JSON.stringify(c))
}

export function clearCustomer(): void {
  localStorage.removeItem(KEY)
}
