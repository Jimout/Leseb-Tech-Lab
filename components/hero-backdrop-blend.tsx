import { cn } from '@/lib/utils'

/** Softer feather than a hard ellipse — hides corners and fades into the page grid. */
export const heroBackdropMaskClass = cn(
  'mask-[radial-gradient(ellipse_132%_120%_at_100%_-6%,#000_6%,#000_26%,rgba(0,0,0,0.5)_48%,rgba(0,0,0,0.12)_76%,transparent_96%)]',
  '[-webkit-mask-image:radial-gradient(ellipse_132%_120%_at_100%_-6%,#000_6%,#000_26%,rgba(0,0,0,0.5)_48%,rgba(0,0,0,0.12)_76%,transparent_96%)]',
)

export const heroBackdropImageClass = cn(
  'object-contain object-[85%_42%]',
  'opacity-[0.93] contrast-[0.98] saturate-[0.94]',
)

/**
 * Light hero (NattyW): vignette tints use pure `white` so the wash matches the white page, not gray/dark tokens.
 * Dark hero: uses `background` so the blend matches the dark page surface.
 */
export function HeroBackdropBlendOverlays({ variant }: { variant: 'light' | 'dark' }) {
  const edge = cn('via-transparent', variant === 'light' ? 'to-white/58' : 'to-background/58')
  const bottom = variant === 'light' ? 'to-white/48' : 'to-background/48'
  const corner = cn(variant === 'light' ? 'from-white/38' : 'from-background/38')
  const baseWash = variant === 'light' ? 'bg-white/65' : 'bg-background/65'
  const cornerGradientEnd = variant === 'light' ? 'to-white/23' : 'to-background/23'
  return (
    <>
      <div className={cn('pointer-events-none absolute inset-0 z-1', baseWash)} aria-hidden />
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-2',
          'bg-linear-to-br from-transparent via-transparent',
          cornerGradientEnd,
        )}
        aria-hidden
      />
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-2 bg-linear-to-bl',
          corner,
          'via-transparent to-transparent',
        )}
        aria-hidden
      />
      <div
        className={cn('pointer-events-none absolute inset-0 z-2 bg-linear-to-l from-transparent', edge)}
        aria-hidden
      />
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-2 bg-linear-to-b from-transparent via-transparent',
          bottom,
        )}
        aria-hidden
      />
    </>
  )
}
