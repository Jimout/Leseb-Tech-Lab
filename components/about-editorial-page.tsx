import { FluidSplitButton } from '@/components/fluid-split-button'
import { splitAboutLetterBody, type AboutEditorialContentSettings } from '@/lib/admin/site-settings'
import {
  landingPageContentMaxClass,
  landingPageGutterClass,
  landingSectionYClass,
} from '@/lib/landing-page-layout'
import {
  landingSectionKickerClass,
  landingSectionKickerDotClass,
} from '@/lib/landing-page-typography'
import { renderInlineAccentMarkers } from '@/lib/render-accent-markers'
import {
  typeAccentItalic,
  typeBody,
  typeDisplayEditorial,
  typeH1,
  typeH2,
  typeH3,
  typeLabelMuted,
  typeLead,
} from '@/lib/type-scale'
import { cn } from '@/lib/utils'

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

      {/* ── Hero ── */}
      <section
        data-nav-surface="dark"
        className={cn(
          'relative border-b border-border',
          'pb-6 pt-6 sm:pb-8 sm:pt-8 md:pb-10 md:pt-10 lg:pb-11 lg:pt-11',
          landingPageGutterClass,
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-50" aria-hidden />
        <div className={cn('relative', landingPageContentMaxClass)}>
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-2">
              <div className={landingSectionKickerClass}>
                <span className={landingSectionKickerDotClass} aria-hidden />
                {content.heroEyebrow}
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

      {/* ── Letter ── */}
      <section className={cn(landingSectionYClass, landingPageGutterClass)}>
        <div className={cn('grid gap-10 md:grid-cols-12 md:gap-14 lg:gap-16 2xl:gap-20', landingPageContentMaxClass)}>
          {/* Sticky sidebar */}
          <aside className="md:col-span-3">
            <div className="md:sticky md:top-32 md:space-y-2">
              <div className={landingSectionKickerClass}>
                <span className={landingSectionKickerDotClass} aria-hidden />
                {content.letterSidebarLabel}
              </div>
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

          {/* Letter body */}
          <div className="md:col-span-9">
            <div className="rounded-2xl border border-border bg-foreground/[0.02] p-8 sm:p-10 md:p-12 lg:p-14 2xl:p-16">
              <div className="space-y-10">
                <p
                  className={cn(
                    typeH1,
                    'text-3xl md:text-5xl',
                    '2xl:text-6xl 3xl:text-7xl 4xl:text-8xl',
                    '2xl:[text-wrap:wrap] 3xl:[text-wrap:wrap] 4xl:[text-wrap:wrap]',
                  )}
                >
                  {renderInlineAccentMarkers(content.letterOpening)}
                </p>
                {letterBodyParagraphs.map((paragraph, index) => (
                  <p
                    key={`letter-${index}`}
                    className={cn('max-w-3xl 2xl:max-w-none', typeBody, 'text-foreground/70')}
                  >
                    {renderInlineAccentMarkers(paragraph)}
                  </p>
                ))}
                <div className="border-t border-border pt-6">
                  <p className={typeLabelMuted}>{content.letterSignOff}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Principles ── */}
      {visiblePrinciples.length > 0 ? (
        <section
          id="principles"
          data-nav-surface="dark"
          className={cn(
            'border-t border-white/10 bg-background text-white',
            landingSectionYClass,
            landingPageGutterClass,
          )}
        >
          <div className={landingPageContentMaxClass}>
            {/* Section header */}
            <div className="mb-12 grid gap-10 md:grid-cols-12 md:items-end md:gap-12 2xl:mb-16">
              <div className="md:col-span-5">
                <div className={landingSectionKickerClass}>
                  <span className={landingSectionKickerDotClass} aria-hidden />
                  {content.principlesSubheading}
                </div>
                <h2 className={cn(typeH1, 'mt-4 text-white')}>{content.principlesHeading}</h2>
              </div>
            </div>

            {/* Principles list */}
            <ol className="divide-y divide-white/10 border-y border-white/10">
              {visiblePrinciples.map((p) => (
                <li
                  key={p.id}
                  className="grid gap-6 py-10 transition-colors hover:bg-white/5 md:grid-cols-12 md:gap-10 md:py-14"
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

      {/* ── Founders ── */}
      <section
        className={cn(
          'border-t border-border bg-background',
          landingSectionYClass,
          landingPageGutterClass,
        )}
      >
        <div className={landingPageContentMaxClass}>
          <div className="grid gap-10 md:grid-cols-12 md:gap-14 lg:gap-16 2xl:gap-20">
            {/* Label + title — col 1–4 */}
            <div className="md:col-span-4">
              <div className={landingSectionKickerClass}>
                <span className={landingSectionKickerDotClass} aria-hidden />
                {content.foundersEyebrow}
              </div>
              <h2 className={cn('mt-4', typeH2)}>{content.foundersTitle}</h2>
            </div>

            {/* Body — col 5–12 */}
            <div className={cn('space-y-6 md:col-span-8', typeLead, 'text-foreground/80')}>
              {content.foundersParagraphs.map((paragraph, index) => (
                <p
                  key={`founders-${index}`}
                  className={index === 1 ? 'text-muted-foreground' : undefined}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        data-nav-surface="dark"
        className={cn(
          'border-t border-white/10 bg-background text-white',
          landingSectionYClass,
          landingPageGutterClass,
        )}
      >
        <div className={cn('text-center', landingPageContentMaxClass)}>
          <div className={cn(landingSectionKickerClass, 'justify-center')}>
            <span className={landingSectionKickerDotClass} aria-hidden />
            {content.ctaEyebrow}
          </div>
          <h2 className={cn(typeH1, 'mt-6 text-white md:text-7xl')}>
            {content.ctaHeadingBefore}{' '}
            <span className={typeAccentItalic}>{content.ctaHeadingAccent}</span>
          </h2>
          <FluidSplitButton
            className="mt-12"
            label={content.ctaButtonLabel}
            href={content.ctaHref}
            variant="secondary"
          />
        </div>
      </section>
    </div>
  )
}
