import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { splitAboutLetterBody, type AboutEditorialContentSettings } from '@/lib/admin/site-settings'
import { landingPageContentMaxClass, landingPageGutterClass } from '@/lib/landing-page-layout'
import { renderInlineAccentMarkers } from '@/lib/render-accent-markers'
import {
  typeAccentItalic,
  typeBody,
  typeDisplayEditorial,
  typeH1,
  typeH2,
  typeH3,
  typeLabelMuted,
  typeLabelSm,
  typeLead,
} from '@/lib/type-scale'
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
              <div className="flex items-center gap-2 typeLabelSm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden /> {content.heroEyebrow}
              </div>
            </div>
            <div className="md:col-span-10">
              <h1 className={typeDisplayEditorial}>
                {content.heroLine1}
                <br />
                <span className={typeAccentItalic}>{content.heroAccent}</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className={cn('py-24 md:py-40', landingPageGutterClass)}>
        <div className={cn('grid gap-10 md:grid-cols-12', landingPageContentMaxClass)}>
          <aside className="md:col-span-3">
            <div className="md:sticky md:top-32 md:space-y-2">
              <p className="typeLabelSm">{content.letterSidebarLabel}</p>
              <p className={cn('mt-2 md:mt-0', typeLabelMuted, 'normal-case')}>
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
            <p className={cn(typeH1, 'text-3xl md:text-5xl')}>
              {renderInlineAccentMarkers(content.letterOpening)}
            </p>
            {letterBodyParagraphs.map((paragraph, index) => (
              <p
                key={`letter-${index}`}
                className={cn('max-w-3xl', typeBody, 'text-foreground/80')}
              >
                {renderInlineAccentMarkers(paragraph)}
              </p>
            ))}

            <p className={cn('pt-6', typeLabelMuted)}>{content.letterSignOff}</p>
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
              <h2 className={cn(typeH1, 'text-white')}>{content.principlesHeading}</h2>
              <p className={cn('hidden md:block', typeLabelSm)}>
                {content.principlesSubheading}
              </p>
            </div>
            <ol className="divide-y divide-white/15 border-y border-white/15">
              {visiblePrinciples.map((p) => (
                <li
                  key={p.id}
                  className="grid gap-6 px-2 py-10 transition-colors hover:bg-white/5 md:grid-cols-12 md:py-14"
                >
                  <div className={cn(typeH1, 'text-signal md:col-span-2 md:text-5xl')}>{p.numeral}</div>
                  <div className="md:col-span-4">
                    <h3 className={cn(typeH3, 'text-white')}>{p.title}</h3>
                  </div>
                  <div className="md:col-span-6">
                    <p className={cn(typeBody, 'text-white/70')}>{p.body}</p>
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
              <p className="typeLabelSm">{content.foundersEyebrow}</p>
              <h2 className={cn('mt-4', typeH2)}>{content.foundersTitle}</h2>
            </div>
            <div className={cn('space-y-6 md:col-span-8', typeLead, 'text-foreground/80')}>
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
          <p className="mb-6 typeLabelSm">{content.ctaEyebrow}</p>
          <h2 className={cn(typeH1, 'text-white md:text-7xl')}>
            {content.ctaHeadingBefore}{' '}
            <span className={typeAccentItalic}>{content.ctaHeadingAccent}</span>
          </h2>
          <Link
            href={content.ctaHref}
            className={cn(
              'group mt-12 inline-flex items-center gap-3 rounded-full bg-secondary py-3 pr-3 pl-7 text-secondary-foreground transition-transform hover:scale-[1.03]',
              typeLabelSm,
            )}
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
