import { Layers, ShieldCheck, Users, Workflow } from 'lucide-react'

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
import { cn } from '@/lib/utils'

const steps = [
  {
    n: '01',
    icon: Users,
    title: 'Listen first',
    body: "We embed with the people who'll use what we build, before a line of code exists.",
  },
  {
    n: '02',
    icon: Layers,
    title: 'Prototype in the open',
    body: 'Small, honest experiments. We share early, often, and with the community in the room.',
  },
  {
    n: '03',
    icon: Workflow,
    title: 'Engineer with care',
    body: 'Performance, accessibility, and language coverage are not features; they are the floor.',
  },
  {
    n: '04',
    icon: ShieldCheck,
    title: 'Hand it back',
    body: 'We ship tools that local teams can own, extend, and outgrow us with.',
  },
] as const

export function ApproachSection() {
  return (
    <section
      id="approach"
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
              <span className={landingSectionKickerDotClass} aria-hidden /> Our Unique Approach
            </div>
            <h2 className={landingSectionTitleClass}>
              Different by <span className={landingSectionTitleAccentClass}>design.</span>
            </h2>
          </div>
          <div className={landingSectionHeaderAsideClass}>
            <p className={landingSectionHeaderIntroClass}>
              We optimize for outcomes, not output. Slower starts, deeper roots, and software that still makes sense
              years from now.
            </p>
          </div>
        </div>

        <ol className={landingPillarGridClass}>
          {steps.map(({ n, icon: Icon, title, body }) => (
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

