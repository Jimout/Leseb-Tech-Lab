import { ThreeDotsLoader } from '@/components/three-dots-loader'
import { cn } from '@/lib/utils'

type AdminLoadingScreenProps = {
  /** @deprecated No longer shown — kept for call-site compatibility. */
  message?: string
  fullViewport?: boolean
  className?: string
}

export function AdminLoadingScreen({
  fullViewport = false,
  className,
}: AdminLoadingScreenProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-center',
        fullViewport ? 'min-h-dvh' : 'min-h-[min(40vh,24rem)]',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <ThreeDotsLoader />
    </div>
  )
}
