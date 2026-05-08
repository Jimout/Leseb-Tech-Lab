import { cn } from '@/lib/utils'

/**
 * Full viewport width with no extra max-width rail on 2xl / 3xl / 4xl.
 */
export const containerMaxWidthClass = 'w-full max-w-none'

/**
 * Tighter horizontal inset for the nav shell only (`SiteNavbar`).
 */
export const navbarPaddingClass = cn(
  'px-2 lg:px-4 2xl:px-0 3xl:px-0 4xl:px-0',
)

/**
 * Page content, footer, banners — wider than `navbarPaddingClass`; scaled up at every breakpoint.
 */
export const containerPaddingClass = cn(
  'px-8 sm:px-10 md:px-12 lg:px-14 xl:px-16',
  '2xl:px-20 3xl:px-28 4xl:px-32',
)

export type ContainerProps = {
  className?: string
  children: React.ReactNode
}

export function Container({ className, children }: ContainerProps) {
  return (
    <div className={cn('mx-auto min-w-0', containerMaxWidthClass, containerPaddingClass, className)}>
      {children}
    </div>
  )
}
