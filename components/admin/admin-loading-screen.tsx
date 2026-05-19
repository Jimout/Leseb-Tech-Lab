import Image from 'next/image'

import { ADMIN_BRAND_NAME, ADMIN_LOGO_SRC } from '@/lib/admin/admin-brand'
import { pageEyebrowDotClass } from '@/lib/section-kicker-classes'
import { typeH3 } from '@/lib/type-scale'
import { cn } from '@/lib/utils'

type AdminLoadingScreenProps = {
  message?: string
  fullViewport?: boolean
  className?: string
}

export function AdminLoadingScreen({
  message = 'Loading',
  fullViewport = false,
  className,
}: AdminLoadingScreenProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center px-6 py-16 animate-fade-up',
        fullViewport ? 'min-h-dvh' : 'min-h-[min(52vh,32rem)]',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative">
        <div
          className="absolute -inset-4 rounded-full bg-primary/15 motion-safe:animate-pulse"
          aria-hidden
        />
        <div className="relative size-16 sm:size-[4.5rem]">
          <Image
            src={ADMIN_LOGO_SRC}
            alt=""
            fill
            sizes="72px"
            className="object-contain object-center motion-safe:animate-float"
            aria-hidden
            priority
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <span className={pageEyebrowDotClass} aria-hidden />
          <p className={cn(typeH3, 'text-white sm:text-2xl')}>
            {ADMIN_BRAND_NAME}
          </p>
        </div>
        <p className="text-sm text-white/60 sm:text-base">{message}</p>
      </div>
    </div>
  )
}
