'use client'

import Image from 'next/image'

import { cn } from '@/lib/utils'

export function AdminSidebarBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative size-10 shrink-0 sm:size-11 lg:size-11 xl:size-12 2xl:size-12 3xl:size-[3.25rem] 4xl:size-14">
        <Image
          src="/images/Logo.png"
          alt=""
          fill
          sizes="(max-width: 640px) 40px, (max-width: 1536px) 44px, (max-width: 1920px) 48px, 56px"
          className="object-contain object-center scale-125"
          aria-hidden
        />
      </div>
      <p
        className={cn(
          'font-semibold text-white',
          'text-sm sm:text-[15px] lg:text-base xl:text-lg',
          '2xl:text-xl 3xl:text-xl 4xl:text-2xl',
        )}
      >
        natty<span className="text-accent">opia</span> space
      </p>
    </div>
  )
}
