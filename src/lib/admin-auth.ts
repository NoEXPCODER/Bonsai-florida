import 'server-only'

export function getAdminPin(): string {
  const pin = process.env.ADMIN_PIN ?? process.env.STAFF_ADMIN_PIN

  if (!pin) {
    throw new Error('ADMIN_PIN or STAFF_ADMIN_PIN env var is not set.')
  }

  return pin
}
