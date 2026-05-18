import { FluidSplitButton } from '@/components/fluid-split-button'
import {
  landingPageContentMaxClass,
  landingPageGutterClass,
} from '@/lib/landing-page-layout'
import {
  landingSectionHeaderAsideClass,
  landingSectionHeaderGridClass,
  landingSectionHeaderLeadClass,
  landingSectionHeaderIntroClass,
  landingSectionKickerClass,
  landingSectionKickerDotClass,
  landingPillarBodyClass,
  landingPillarCardClass,
  landingPillarGridClass,
  landingPillarTitleClass,
  landingSectionTitleAccentClass,
  landingSectionTitleClass,
} from '@/lib/landing-page-typography'
import { SERVICE_PILLARS } from '@/lib/services-pillars'
import { cn } from '@/lib/utils'

export function LabSection() {
  return (
    <section
      id="lab"
      data-nav-surface="dark"
      className={cn(
        'relative min-w-0 scroll-mt-24 overflow-x-clip bg-background py-0',
        landingPageGutterClass,
      )}
    >
      <div
        className={cn('relative mx-auto min-w-0', landingPageContentMaxClass)}
      >
        <div className={landingSectionHeaderGridClass}>
          <div className={landingSectionHeaderLeadClass}>
            <div className={cn('mb-4', landingSectionKickerClass)}>
              <span className={landingSectionKickerDotClass} aria-hidden /> Services
            </div>
            <h2 className={landingSectionTitleClass}>
              What we <span className={landingSectionTitleAccentClass}>do.</span>
            </h2>
          </div>
          <div className={landingSectionHeaderAsideClass}>
            <p className={landingSectionHeaderIntroClass}>
              Four practices, one brief, software that serves the human in front of the screen.
            </p>
            <div className="mt-4 shrink-0">
              <FluidSplitButton
                label="View services page"
                href="/services"
                variant="secondary"
                size="navbar"
              />
            </div>
          </div>
        </div>

        <ol className={landingPillarGridClass}>
          {SERVICE_PILLARS.map(({ n, icon: Icon, title, body }) => (
            <li key={n} className={landingPillarCardClass}>
              <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-accent scale-0 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100" style={{ transformOrigin: 'center' }} />
                <div className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-accent scale-0 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100" style={{ transformOrigin: 'center' }} />
                <div className="absolute left-0 bottom-0 h-6 w-6 border-l-2 border-b-2 border-accent scale-0 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100" style={{ transformOrigin: 'center' }} />
                <div className="absolute right-0 bottom-0 h-6 w-6 border-r-2 border-b-2 border-accent scale-0 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100" style={{ transformOrigin: 'center' }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground transition-colors duration-500 group-hover:text-foreground/70">
                  {n}
                </span>
                <Icon
                  className="size-5 text-signal transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12 group-hover:text-foreground"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>

              <div className="transition-transform duration-500 group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                <h3 className={landingPillarTitleClass}>{title}</h3>
                <p className={landingPillarBodyClass}>{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

