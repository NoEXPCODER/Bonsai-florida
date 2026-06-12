import 'server-only'

export interface AdminCredentials {
  username: string
  password: string
}

export function getAdminCredentials(): AdminCredentials {
  const username = process.env.ADMIN_USERNAME ?? process.env.STAFF_ADMIN_USERNAME
  const password =
    process.env.ADMIN_PASSWORD ??
    process.env.STAFF_ADMIN_PASSWORD ??
    process.env.ADMIN_PIN ??
    process.env.STAFF_ADMIN_PIN

  if (!username || !password) {
    throw new Error(
      'ADMIN_USERNAME and ADMIN_PASSWORD must be set as server-only environment variables.',
    )
  }

  return { username, password }
}
