import { FluidSplitButton } from '@/components/fluid-split-button'
import { showcaseWorkToLabItem, WorksLabShowcaseGrid } from '@/components/works-lab-grid'
import { getLandingLabWorks } from '@/lib/works-showcase-data'
import {
  landingPageContentMaxClass,
  landingPageGutterClass,
} from '@/lib/landing-page-layout'
import {
  landingBandClass,
  landingSectionHeaderSplitClass,
  landingSectionKickerClass,
  landingSectionKickerDotClass,
  landingSectionTitleAccentClass,
  landingSectionTitleXLClass,
} from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'

const landingLabItems = getLandingLabWorks().map(showcaseWorkToLabItem)

export function WorksSection() {
  return (
    <section
      id="work"
      data-nav-surface="dark"
      className={cn('relative min-w-0 overflow-x-clip py-0', landingBandClass, landingPageGutterClass)}
    >
      <div className={cn('mx-auto min-w-0', landingPageContentMaxClass)}>
        <div className={landingSectionHeaderSplitClass}>
          <div>
            <div className={cn('mb-4', landingSectionKickerClass)}>
              <span className={landingSectionKickerDotClass} aria-hidden /> In the Lab
            </div>
            <h2 className={landingSectionTitleXLClass}>
              What we&apos;re <span className={landingSectionTitleAccentClass}>building.</span>
            </h2>
          </div>
          <div className="shrink-0 md:self-end">
            <FluidSplitButton label="All projects" href="/work" variant="secondary" size="navbar" />
          </div>
        </div>

        <WorksLabShowcaseGrid items={landingLabItems} layout="landing" />
      </div>
    </section>
  )
}
