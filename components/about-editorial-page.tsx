import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

import { landingPageContentMaxClass, landingPageGutterClass } from '@/lib/landing-page-layout'
import { cn } from '@/lib/utils'

const principles = [
  {
    n: 'I.',
    t: 'People before platforms',
    b: 'Every decision passes through one filter: does this serve the human in front of the screen, or only the system behind it?',
  },
  {
    n: 'II.',
    t: 'AI with restraint',
    b: 'We use intelligence where it removes friction, not where it manufactures dependence. The model is a tool, never the destination.',
  },
  {
    n: 'III.',
    t: 'Built in the open',
    b: 'We document our reasoning, share our trade-offs, and invite scrutiny. Trust is earned by being legible.',
  },
  {
    n: 'IV.',
    t: 'Social change as a brief',
    b: 'Profit is a byproduct. The brief is impact, measured in lives made calmer, work made lighter, voices made heard.',
  },
] as const

const rail = cn(landingPageContentMaxClass, landingPageGutterClass)

function AboutFoundersSection() {
  return (
    <section className={cn('border-t border-border bg-background py-24 md:py-32', landingPageGutterClass)}>
      <div className={landingPageContentMaxClass}>
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Founders</p>
            <h2 className="mt-4 font-display text-3xl tracking-tight md:text-4xl">A lab in Addis Ababa</h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-foreground/80 md:col-span-8 md:text-xl">
            <p>
              Leseb Tech Lab is a small, intentional team. We work shoulder-to-shoulder with communities and
              partners, not as vendors, but as co-authors of the tools people rely on every day.
            </p>
            <p className="text-muted-foreground">
              Names and faces belong in conversation, not in a carousel. If you are building something humane and need
              a thoughtful technical partner, we would love to hear from you.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AboutEditorialPage() {
  return (
    <div className="min-w-0 bg-background text-foreground">
      {/* Hero */}
      <section data-nav-surface="dark" className="relative border-b border-border pb-24 pt-32 md:pb-32 md:pt-44">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-50" aria-hidden />
        <div className={cn('relative', rail)}>
          <div className="grid items-end gap-10 md:grid-cols-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-signal">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden /> About
              </div>
            </div>
            <div className="md:col-span-10">
              <h1 className="font-display text-[12vw] leading-[0.92] tracking-[-0.04em] text-balance md:text-[8vw]">
                We build technology
                <br />
                <span className="font-light italic text-signal">for humans.</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Letter */}
      <section className={cn('py-24 md:py-40', landingPageGutterClass)}>
        <div className={cn('grid gap-10 md:grid-cols-12', landingPageContentMaxClass)}>
          <aside className="md:col-span-3">
            <div className="md:sticky md:top-32 md:space-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal">A letter</p>
              <p className="mt-2 font-mono text-xs text-muted-foreground md:mt-0">
                From the founders
                <br />
                Addis Ababa, 2026
              </p>
            </div>
          </aside>
          <div className="space-y-10 md:col-span-9">
            <p className="font-display text-balance text-3xl leading-[1.15] tracking-tight md:text-5xl">
              <span className="text-signal">Leseb</span>{' '}
              <span className="align-middle font-mono text-base text-muted-foreground">(ለሰብ)</span> means{' '}
              <em className="font-light italic">&quot;for humans&quot;</em> in Ge&apos;ez. It is the oldest word we could find for
              the newest thing we are trying to do.
            </p>
            <p className="max-w-3xl text-lg leading-relaxed text-foreground/80 md:text-xl">
              We founded Leseb Tech Lab because the industry told us to move fast and break things. We watched what got
              broken: attention, trust, the quiet hours of the day. So we slowed down. We started a lab, not a factory,
              to study how software could feel like a friend instead of a feed.
            </p>
            <p className="max-w-3xl text-lg leading-relaxed text-foreground/80 md:text-xl">
              The work ahead is wide. AI is rewriting the contract between people and machines. We intend to write our
              share of that contract carefully, in a language a person can read.
            </p>
            <p className="max-w-3xl text-lg leading-relaxed text-foreground/80 md:text-xl">
              At Leseb, we believe{' '}
              <span className="text-signal">social change is not optional; it is necessary</span>. Technology is one of
              the few levers large enough to move it. We plan to pull, gently, with both hands.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span>The Leseb Founders</span>
              <span className="h-px w-16 bg-border" aria-hidden />
              <span>ለሰብ · For humans</span>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section
        id="principles"
        className={cn(
          'border-t border-white/10 bg-background py-24 text-white md:py-32',
          landingPageGutterClass,
        )}
      >
        <div className={landingPageContentMaxClass}>
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-4xl tracking-tight text-white md:text-6xl">Four principles.</h2>
            <p className="hidden font-mono text-xs uppercase tracking-[0.25em] text-signal md:block">The work, codified</p>
          </div>
          <ol className="divide-y divide-white/15 border-y border-white/15">
            {principles.map((p) => (
              <li
                key={p.n}
                className="grid gap-6 px-2 py-10 transition-colors hover:bg-white/5 md:grid-cols-12 md:py-14"
              >
                <div className="font-display text-3xl tracking-tight text-signal md:col-span-2 md:text-5xl">{p.n}</div>
                <div className="md:col-span-4">
                  <h3 className="font-display text-2xl tracking-tight text-white md:text-3xl">{p.t}</h3>
                </div>
                <div className="md:col-span-6">
                  <p className="text-base leading-relaxed text-white/70 md:text-lg">{p.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <AboutFoundersSection />

      {/* Closing CTA */}
      <section
        data-nav-surface="dark"
        className={cn('border-t border-white/10 bg-background py-32 text-white', landingPageGutterClass)}
      >
        <div className={cn('text-center', landingPageContentMaxClass)}>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-signal">Continue</p>
          <h2 className="font-display text-balance text-4xl tracking-tight text-white md:text-7xl">
            See what we&apos;re <span className="font-light italic text-signal">building.</span>
          </h2>
          <Link
            href="/"
            className="group mt-12 inline-flex items-center gap-3 rounded-full bg-secondary py-3 pr-3 pl-7 font-mono text-xs uppercase tracking-[0.2em] text-secondary-foreground transition-transform hover:scale-[1.03]"
          >
            Back to the lab
            <span className="grid size-8 place-items-center rounded-full bg-secondary-foreground/10 transition-transform group-hover:rotate-45">
              <ArrowUpRight className="size-4" aria-hidden />
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}
