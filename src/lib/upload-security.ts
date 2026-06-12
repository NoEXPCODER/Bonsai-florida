import 'server-only'

export const MAX_IMAGE_UPLOAD_BYTES = 6 * 1024 * 1024

const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp'])
const ALLOWED_IMAGE_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
])

export function validateImageFile(file: File):
  | { ok: true; extension: string }
  | { ok: false; error: string; status: number } {
  if (file.size <= 0) {
    return { ok: false, error: 'Empty file', status: 400 }
  }

  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return { ok: false, error: 'Image is too large', status: 413 }
  }

  const extension = ALLOWED_IMAGE_TYPES.get(file.type)
  if (!extension) {
    return { ok: false, error: 'Unsupported image type', status: 400 }
  }

  return { ok: true, extension }
}

export function sanitizeStoragePath(input: string): string | null {
  const path = input.trim().replace(/\\/g, '/')

  if (!path || path.length > 180) return null
  if (path.startsWith('/') || path.endsWith('/') || path.includes('//')) return null
  if (path.split('/').some(segment => segment === '..' || segment === '.')) return null

  const segments = path.split('/')
  if (segments.length > 2) return null
  if (!segments.every(segment => /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(segment))) return null

  const extension = segments[segments.length - 1].split('.').pop()?.toLowerCase()
  if (!extension || !ALLOWED_IMAGE_EXTENSIONS.has(extension)) return null

  return path
}

export function hasValidImageSignature(bytes: Uint8Array, contentType: string): boolean {
  if (contentType === 'image/jpeg') {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  }

  if (contentType === 'image/png') {
    return (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    )
  }

  if (contentType === 'image/webp') {
    return (
      bytes.length >= 12 &&
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    )
  }

  return false
}
