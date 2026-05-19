import Image from 'next/image'

import { ADMIN_BRAND_NAME, ADMIN_LOGO_SRC } from '@/lib/admin/admin-brand'
import { cn } from '@/lib/utils'

const logoSizeClass = {
  sm: 'size-9',
  md: 'size-10 sm:size-11',
  lg: 'size-12 sm:size-14',
} as const

type AdminBrandMarkProps = {
  className?: string
  showWordmark?: boolean
  logoSize?: keyof typeof logoSizeClass
}

export function AdminBrandMark({
  className,
  showWordmark = true,
  logoSize = 'md',
}: AdminBrandMarkProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <div className={cn('relative shrink-0', logoSizeClass[logoSize])}>
        <Image
          src={ADMIN_LOGO_SRC}
          alt=""
          fill
          sizes="56px"
          className="object-contain object-center"
          aria-hidden
          priority
        />
      </div>
      {showWordmark ? (
        <p
          className={cn(
            'truncate font-sans font-semibold tracking-tight text-white',
            'text-sm sm:text-base lg:text-lg',
          )}
        >
          {ADMIN_BRAND_NAME}
        </p>
      ) : null}
    </div>
  )
}
