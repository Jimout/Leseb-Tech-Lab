import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { splitAboutLetterBody, type AboutEditorialContentSettings } from '@/lib/admin/site-settings'
import { landingPageContentMaxClass, landingPageGutterClass } from '@/lib/landing-page-layout'
import { renderInlineAccentMarkers } from '@/lib/render-accent-markers'
import { cn } from '@/lib/utils'

const rail = cn(landingPageContentMaxClass, landingPageGutterClass)

type AboutEditorialPageProps = {
  content: AboutEditorialContentSettings
}

export function AboutEditorialPage({ content }: AboutEditorialPageProps) {
  const visiblePrinciples = content.principles.filter((p) => p.visible)
  const letterSidebarLines = content.letterSidebarMeta
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const letterBodyParagraphs = splitAboutLetterBody(content.letterBody)

  return (
    <div className="min-w-0 bg-background text-foreground">
      <section data-nav-surface="dark" className="relative border-b border-border pb-24 pt-32 md:pb-32 md:pt-44">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-50" aria-hidden />
        <div className={cn('relative', rail)}>
          <div className="grid items-end gap-10 md:grid-cols-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-signal">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden /> {content.heroEyebrow}
              </div>
            </div>
            <div className="md:col-span-10">
              <h1 className="font-display text-[12vw] leading-[0.92] tracking-[-0.04em] text-balance md:text-[8vw]">
                {content.heroLine1}
                <br />
                <span className="font-light italic text-signal">{content.heroAccent}</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className={cn('py-24 md:py-40', landingPageGutterClass)}>
        <div className={cn('grid gap-10 md:grid-cols-12', landingPageContentMaxClass)}>
          <aside className="md:col-span-3">
            <div className="md:sticky md:top-32 md:space-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal">{content.letterSidebarLabel}</p>
              <p className="mt-2 font-mono text-xs text-muted-foreground md:mt-0">
                {letterSidebarLines.map((line, index) => (
                  <span key={`${line}-${index}`}>
                    {index > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </aside>
          <div className="space-y-10 md:col-span-9">
            <p className="font-display text-balance text-3xl leading-[1.15] tracking-tight md:text-5xl">
              {renderInlineAccentMarkers(content.letterOpening)}
            </p>
            {letterBodyParagraphs.map((paragraph, index) => (
              <p
                key={`letter-${index}`}
                className="max-w-3xl text-lg leading-relaxed text-foreground/80 md:text-xl"
              >
                {renderInlineAccentMarkers(paragraph)}
              </p>
            ))}

            <p className="pt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{content.letterSignOff}</p>
          </div>
        </div>
      </section>

      {visiblePrinciples.length > 0 ? (
        <section
          id="principles"
          className={cn(
            'border-t border-white/10 bg-background py-24 text-white md:py-32',
            landingPageGutterClass,
          )}
        >
          <div className={landingPageContentMaxClass}>
            <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-display text-4xl tracking-tight text-white md:text-6xl">{content.principlesHeading}</h2>
              <p className="hidden font-mono text-xs uppercase tracking-[0.25em] text-signal md:block">
                {content.principlesSubheading}
              </p>
            </div>
            <ol className="divide-y divide-white/15 border-y border-white/15">
              {visiblePrinciples.map((p) => (
                <li
                  key={p.id}
                  className="grid gap-6 px-2 py-10 transition-colors hover:bg-white/5 md:grid-cols-12 md:py-14"
                >
                  <div className="font-display text-3xl tracking-tight text-signal md:col-span-2 md:text-5xl">{p.numeral}</div>
                  <div className="md:col-span-4">
                    <h3 className="font-display text-2xl tracking-tight text-white md:text-3xl">{p.title}</h3>
                  </div>
                  <div className="md:col-span-6">
                    <p className="text-base leading-relaxed text-white/70 md:text-lg">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section className={cn('border-t border-border bg-background py-24 md:py-32', landingPageGutterClass)}>
        <div className={landingPageContentMaxClass}>
          <div className="grid gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-4">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal">{content.foundersEyebrow}</p>
              <h2 className="mt-4 font-display text-3xl tracking-tight md:text-4xl">{content.foundersTitle}</h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-foreground/80 md:col-span-8 md:text-xl">
              {content.foundersParagraphs.map((paragraph, index) => (
                <p key={`founders-${index}`} className={index === 1 ? 'text-muted-foreground' : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        data-nav-surface="dark"
        className={cn('border-t border-white/10 bg-background py-32 text-white', landingPageGutterClass)}
      >
        <div className={cn('text-center', landingPageContentMaxClass)}>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-signal">{content.ctaEyebrow}</p>
          <h2 className="font-display text-balance text-4xl tracking-tight text-white md:text-7xl">
            {content.ctaHeadingBefore}{' '}
            <span className="font-light italic text-signal">{content.ctaHeadingAccent}</span>
          </h2>
          <Link
            href={content.ctaHref}
            className="group mt-12 inline-flex items-center gap-3 rounded-full bg-secondary py-3 pr-3 pl-7 font-mono text-xs uppercase tracking-[0.2em] text-secondary-foreground transition-transform hover:scale-[1.03]"
          >
            {content.ctaButtonLabel}
            <span className="grid size-8 place-items-center rounded-full bg-secondary-foreground/10 transition-transform group-hover:rotate-45">
              <ArrowUpRight className="size-4" aria-hidden />
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}
