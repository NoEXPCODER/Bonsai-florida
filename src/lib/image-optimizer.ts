export interface OptimizedImageResult {
  file: File
  width: number
  height: number
  originalSize: number
  optimizedSize: number
}

interface OptimizeOptions {
  maxWidth?: number
  quality?: number
  outputType?: 'image/jpeg' | 'image/webp'
}

const DEFAULT_OPTIONS: Required<OptimizeOptions> = {
  maxWidth: 1200,
  quality: 0.78,
  outputType: 'image/jpeg',
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read image'))
    }
    img.src = url
  })
}

function extensionForType(type: string) {
  return type === 'image/webp' ? 'webp' : 'jpg'
}

function cleanBaseName(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'bonsai-photo'
}

export async function optimizeTreeImage(file: File, options: OptimizeOptions = {}): Promise<OptimizedImageResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Selected file is not an image')
  }

  const config = { ...DEFAULT_OPTIONS, ...options }
  const img = await loadImage(file)
  const scale = Math.min(1, config.maxWidth / img.naturalWidth)
  const width = Math.max(1, Math.round(img.naturalWidth * scale))
  const height = Math.max(1, Math.round(img.naturalHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Image compression is not supported in this browser')
  ctx.drawImage(img, 0, 0, width, height)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      result => result ? resolve(result) : reject(new Error('Image compression failed')),
      config.outputType,
      config.quality,
    )
  })

  const outputName = `${cleanBaseName(file.name)}.${extensionForType(config.outputType)}`
  const optimizedFile = new File([blob], outputName, {
    type: config.outputType,
    lastModified: Date.now(),
  })

  return {
    file: optimizedFile,
    width,
    height,
    originalSize: file.size,
    optimizedSize: optimizedFile.size,
  }
}

export function isPermanentImageUrl(url: string | null | undefined) {
  if (!url) return false
  const normalized = url.trim().toLowerCase()
  if (!normalized) return false
  if (normalized.startsWith('blob:')) return false
  if (normalized.startsWith('file:')) return false
  if (normalized.includes('localhost')) return false
  if (normalized.startsWith('/public/uploads')) return false
  return normalized.startsWith('https://')
}
