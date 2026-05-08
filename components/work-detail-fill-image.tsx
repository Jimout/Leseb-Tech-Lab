import { MediaRenderer } from '@/components/media-renderer'
import { cn } from '@/lib/utils'

type Props = {
  src: string
  alt: string
  sizes: string
  className?: string
  priority?: boolean
  fill?: boolean
}

export function WorkDetailFillImage({
  src,
  alt,
  sizes,
  className,
  priority,
  fill = true,
}: Props) {
  return (
    <MediaRenderer
      media={{ type: 'image', url: src, alt }}
      sizes={sizes}
      className={cn(fill ? 'absolute inset-0 size-full object-cover object-center' : 'object-cover object-center', className)}
      variant="default"
      showSkeleton={!priority}
    />
  )
}
