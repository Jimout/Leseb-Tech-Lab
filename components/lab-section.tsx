import { Brain, Globe2, LineChart, Users } from 'lucide-react'

import { landingPageContentMaxClass, landingPageGutterClass } from '@/lib/landing-page-layout'
import { cn } from '@/lib/utils'

const pillars = [
  {
    n: '01',
    icon: Brain,
    title: 'AI Solutions for Everyday Life',
    body: 'We design human-centered AI tools that improve decision-making, automate tasks, and empower people.',
  },
  {
    n: '02',
    icon: Globe2,
    title: 'Web & Software Development',
    body: 'We build intuitive web and software solutions that simplify daily life.',
  },
  {
    n: '03',
    icon: LineChart,
    title: 'Data-Driven Platforms',
    body: 'Our systems transform raw data into clarity, insight, and better social outcomes.',
  },
  {
    n: '04',
    icon: Users,
    title: 'Community-Driven Innovation',
    body: 'We stay close to people, communities, and real challenges, ensuring our solutions create real impact.',
  },
] as const

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
        className={cn(
          'relative mx-auto min-w-0 py-16 md:py-24 lg:py-28 xl:py-32',
          landingPageContentMaxClass,
        )}
      >
        <div className="mb-10 grid gap-10 md:mb-12 md:grid-cols-12 md:gap-12 lg:mb-14">
          <div className="min-w-0 md:col-span-5">
            <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-signal">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden /> Services
            </div>
            <h2 className="font-display text-balance text-4xl leading-[0.95] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl">
              What we <span className="font-light italic text-signal">do.</span>
            </h2>
          </div>
          <div className="flex min-w-0 items-end md:col-span-6 md:col-start-7">
            <p className="text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
              Four practices, one brief, software that serves the human in front of the screen.
            </p>
          </div>
        </div>

        <ol className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ n, icon: Icon, title, body }) => (
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
