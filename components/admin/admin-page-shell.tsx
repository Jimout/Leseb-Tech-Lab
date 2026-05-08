'use client'

import { cn } from '@/lib/utils'

export function AdminPageShell({
  title,
  description,
  right,
  children,
  className,
}: {
  title: string
  description?: string
  right?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('w-full min-w-0', className)}>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between lg:gap-4 2xl:gap-5">
        <div className="min-w-0">
          <h1
            className={cn(
              'text-balance font-bold tracking-tight text-white',
              'text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-4xl',
              '2xl:text-5xl 3xl:text-5xl 4xl:text-6xl',
            )}
          >
            {title}
          </h1>
          {description ? (
            <p
              className={cn(
                'mt-1 text-white/70',
                'text-sm sm:text-base lg:text-lg xl:text-lg',
                '2xl:text-xl 3xl:text-xl 4xl:text-2xl',
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </header>
      <div className="mt-6 sm:mt-8 lg:mt-10 xl:mt-10 2xl:mt-12">{children}</div>
    </section>
  )
}

