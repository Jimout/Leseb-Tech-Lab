import { FluidSplitButton } from '@/components/fluid-split-button'
import { WorksLabShowcaseGrid, type WorksLabGridItem } from '@/components/works-lab-grid'
import {
  landingPageContentMaxClass,
  landingPageGutterClass,
  landingSectionYClass,
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

const projects: WorksLabGridItem[] = [
  {
    id: 'selam-os',
    title: 'Selam OS',
    tag: 'Conversational AI',
    desc: 'An assistant that speaks your language, literally and culturally.',
    imgSrc:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80',
    year: '2026',
    href: '/work',
  },
  {
    id: 'mesob',
    title: 'Mesob',
    tag: 'Civic Tech',
    desc: 'Tools that help communities organize, decide, and act together.',
    imgSrc: '/images/biom.jpg',
    year: '2026',
    href: '/work',
  },
  {
    id: 'atlas',
    title: 'Atlas',
    tag: 'Knowledge Systems',
    desc: 'Structured memory and retrieval so teams can ship with shared context.',
    imgSrc:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
    year: '2026',
    href: '/work',
  },
  {
    id: 'harbor',
    title: 'Harbor',
    tag: 'Infrastructure',
    desc: 'Reliable pipelines and observability for products that cannot go dark.',
    imgSrc:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
    year: '2026',
    href: '/work',
  },
]

export function WorksSection() {
  return (
    <section
      id="work"
      data-nav-surface="dark"
      className={cn('relative min-w-0 overflow-x-clip py-0', landingBandClass, landingPageGutterClass)}
    >
      <div className={cn('mx-auto min-w-0', landingSectionYClass, landingPageContentMaxClass)}>
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

        <WorksLabShowcaseGrid items={projects} />
      </div>
    </section>
  )
}
