import { Layers, ShieldCheck, Users, Workflow } from 'lucide-react'

import { landingPageContentMaxClass, landingPageGutterClass } from '@/lib/landing-page-layout'
import { cn } from '@/lib/utils'

const steps = [
  {
    n: '01',
    icon: Users,
    title: 'Listen first',
    body: "We embed with the people who'll use what we build — before a line of code exists.",
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
    body: 'Performance, accessibility, and language coverage are not features — they are the floor.',
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
      data-nav-surface="light"
      className={cn(
        'relative min-w-0 scroll-mt-24 overflow-x-clip bg-background py-16 md:py-24 lg:py-28 xl:py-32',
        landingPageGutterClass,
      )}
    >
      <div className={cn('relative mx-auto min-w-0', landingPageContentMaxClass)}>
        <div className="mb-10 grid gap-10 md:mb-12 md:grid-cols-12 md:gap-12 lg:mb-14">
          <div className="min-w-0 md:col-span-5">
            <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-signal">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden /> Our Unique Approach
            </div>
            <h2 className="font-display text-balance text-4xl leading-[0.95] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl">
              Different by <span className="font-light italic text-signal">design.</span>
            </h2>
          </div>
          <div className="flex min-w-0 items-end md:col-span-6 md:col-start-7">
            <p className="text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
              Most labs optimize for output. We optimize for outcome — slower starts, deeper roots, and software that
              still makes sense five years from now.
            </p>
          </div>
        </div>

        <ol className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ n, icon: Icon, title, body }) => (
            <li
              key={n}
              className="group relative isolate flex min-h-[240px] flex-col justify-between overflow-hidden bg-background p-7 sm:min-h-[260px] sm:p-8 md:p-10"
            >
              <div className="pointer-events-none absolute inset-0 -z-10 translate-y-full gradient-signal transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0 motion-reduce:transition-none motion-reduce:group-hover:translate-y-full" />

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
                <h3 className="mb-3 font-display text-2xl tracking-tight transition-colors duration-500 group-hover:text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-foreground/85">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
