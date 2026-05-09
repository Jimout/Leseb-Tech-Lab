import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

import { FluidSplitButton } from '@/components/fluid-split-button'
import { landingPageContentMaxClass, landingPageGutterClass } from '@/lib/landing-page-layout'
import { cn } from '@/lib/utils'

const projects = [
  {
    title: 'Selam OS',
    tag: 'Conversational AI',
    desc: 'An assistant that speaks your language, literally and culturally.',
    imgSrc:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80',
    year: '2026',
  },
  {
    title: 'Mesob',
    tag: 'Civic Tech',
    desc: 'Tools that help communities organize, decide, and act together.',
    imgSrc: '/images/biom.jpg',
    year: '2026',
  },
  {
    title: 'Atlas',
    tag: 'Knowledge Systems',
    desc: 'Structured memory and retrieval so teams can ship with shared context.',
    imgSrc:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
    year: '2026',
  },
  {
    title: 'Harbor',
    tag: 'Infrastructure',
    desc: 'Reliable pipelines and observability for products that cannot go dark.',
    imgSrc:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
    year: '2026',
  },
] as const

const ROW1 = projects.slice(0, 2)
const ROW2 = projects.slice(2, 4)

type LabProject = (typeof projects)[number]

function WorksLabRow({ items }: { items: readonly LabProject[] }) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 md:pb-16 lg:gap-10 2xl:gap-12 2xl:pb-20 3xl:pb-24">
      {items.map((p, i) => (
        <WorksLabCard key={p.title} p={p} className={i === 1 ? 'md:translate-y-16' : undefined} />
      ))}
    </div>
  )
}

function WorksLabCard({ p, className }: { p: LabProject; className?: string }) {
  return (
    <a
      href="/work"
      className={cn(
        'group relative block rounded-3xl overflow-hidden bg-[#0b0b0b] aspect-2/1 md:aspect-video',
        className,
      )}
    >
      <Image
        src={p.imgSrc}
        alt={p.title}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />

      <div className="absolute top-6 left-6 right-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">
        <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur border border-white/10">
          {p.tag}
        </span>
        <span>{p.year}</span>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-7 md:p-9">
        <h3 className="font-display mb-3 flex flex-wrap items-center gap-2 text-3xl tracking-tight sm:gap-3 md:text-5xl lg:text-6xl 2xl:text-7xl">
          {p.title}
          <ArrowUpRight className="w-6 h-6 text-[#DFE222] group-hover:rotate-45 transition-transform" />
        </h3>
        <p className="text-white/70 max-w-md text-balance">{p.desc}</p>
      </div>
    </a>
  )
}

export function WorksSection() {
  return (
    <section
      id="work"
      data-nav-surface="dark"
      className={cn('relative min-w-0 overflow-x-clip bg-black py-0 text-white', landingPageGutterClass)}
    >
      <div
        className={cn(
          /** Match landing insights vertical rail spacing exactly. */
          'mx-auto min-w-0 py-16 md:py-24 lg:py-28 xl:py-32',
          landingPageContentMaxClass,
        )}
      >
        <div className="mb-12 flex min-w-0 flex-col gap-6 sm:mb-14 md:mb-16 md:flex-row md:items-end md:justify-between lg:mb-16 xl:mb-20">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#DFE222] flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DFE222]" /> In the Lab
            </div>
            <h2 className="font-display text-balance text-4xl leading-[0.95] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl 3xl:text-9xl">
              What we&apos;re <span className="italic font-light text-[#DFE222]">building.</span>
            </h2>
          </div>
          <div className="shrink-0 md:self-end">
            <FluidSplitButton label="All projects" href="/work" variant="secondary" size="navbar" />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-6 md:gap-8 lg:gap-10 2xl:gap-12">
          <WorksLabRow items={ROW1} />
          <WorksLabRow items={ROW2} />
        </div>
      </div>
    </section>
  )
}
