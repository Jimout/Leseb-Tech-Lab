import { cn } from '@/lib/utils'

/** Mobile-first heading & body scales for pages and sections. */
export const typeH1 = cn(
  'text-2xl font-bold tracking-tight text-balance',
  'sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 3xl:text-6xl 4xl:text-7xl',
)

export const typeH2 = cn(
  'text-xl font-bold tracking-tight text-balance',
  'sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 3xl:text-5xl',
)

export const typeH3 = cn(
  'text-lg font-bold tracking-tight',
  'sm:text-xl md:text-2xl lg:text-3xl',
)

export const typeLead = cn(
  'text-base text-muted-foreground text-balance',
  'sm:text-lg md:text-xl lg:text-2xl',
)

export const typeBody = cn('text-sm text-muted-foreground', 'sm:text-base')

export const typeBodyLg = cn('text-base text-muted-foreground', 'sm:text-lg')
