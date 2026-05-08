function isCloudinaryUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.hostname.includes('res.cloudinary.com')
  } catch {
    return false
  }
}

function injectTransform(url: string, transform: string): string {
  return url.replace('/upload/', `/upload/${transform}/`)
}

export function cloudinaryOptimizedImageUrl(url: string, width?: number): string {
  if (!isCloudinaryUrl(url)) return url
  const resize = width ? `,c_limit,w_${width}` : ''
  return injectTransform(url, `f_auto,q_auto${resize}`)
}

export function cloudinaryVideoPosterUrl(url: string): string | undefined {
  if (!isCloudinaryUrl(url)) return undefined
  return injectTransform(url, 'so_auto,f_jpg,q_auto').replace(/\.[a-zA-Z0-9]+(?:\?.*)?$/, '.jpg')
}
