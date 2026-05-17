'use client'

import { FluidSplitButton } from '@/components/fluid-split-button'
import { useVisitBarFooterOpacity } from '@/hooks/use-visit-bar-footer-opacity'
import { landingPageGutterClass } from '@/lib/landing-page-layout'
import { normalizeExternalUrl } from '@/lib/normalize-external-url'
import { cn } from '@/lib/utils'

export type WorkDetailVisitWebsiteBarProps = {
  websiteUrl: string
  className?: string
}

export function WorkDetailVisitWebsiteBar({ websiteUrl, className }: WorkDetailVisitWebsiteBarProps) {
  const href = normalizeExternalUrl(websiteUrl)
  const opacity = useVisitBarFooterOpacity()

  if (!href) return null

  const hidden = opacity <= 0.02

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-0 z-40',
        'bg-linear-to-t from-background via-background/95 to-transparent pt-6',
        'pb-[max(1rem,env(safe-area-inset-bottom))]',
        'transition-opacity duration-700 ease-out motion-reduce:transition-none',
        landingPageGutterClass,
        hidden && 'pointer-events-none',
        className,
      )}
      style={{ opacity }}
      aria-hidden={hidden}
    >
      <div
        className={cn(
          'flex justify-center',
          hidden ? 'pointer-events-none' : 'pointer-events-auto',
        )}
      >
        <FluidSplitButton
          label="Visit website"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          size="default"
          tabIndex={hidden ? -1 : undefined}
          className="shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
        />
      </div>
    </div>
  )
}
