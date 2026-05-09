import { cn } from '@/lib/utils'

/**
 * Shared horizontal gutters for the home page bands and the nav shell so rails
 * stay aligned from mobile through ultra-wide viewports.
 */
/** From `2xl` up, matches `containerPaddingClass` in `layout/container.tsx` so insights/footer share the same rail. */
export const landingPageGutterClass = cn(
  'px-4 sm:px-5 md:px-7 lg:px-9 xl:px-10',
  '2xl:px-20 3xl:px-28 4xl:px-32',
)

/**
 * Centered content rail — grows slightly past 2xl so layouts do not feel stuck at 1400px.
 */
export const landingPageContentMaxClass = cn(
  'mx-auto w-full min-w-0 max-w-[1400px]',
  '3xl:max-w-[1520px] 4xl:max-w-[1680px]',
)
