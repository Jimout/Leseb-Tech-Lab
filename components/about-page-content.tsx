'use client'

import Image from 'next/image'

import { Container } from '@/components/layout/container'
import { useSiteSettings } from '@/hooks/use-site-settings'
import {
  landingSectionKickerClass,
  landingSectionKickerDotClass,
} from '@/lib/landing-page-typography'
import { renderInlineAccentMarkers } from '@/lib/render-accent-markers'
import { typeH1 } from '@/lib/type-scale'
import { cn } from '@/lib/utils'

function keepSpecificPhrasesOnOneLine(text: string) {
  return text
    .replace(/development,\s+interiors,\s+and/gi, 'development,\u00A0interiors,\u00A0and')
    .replace(/visualization,\s+creating\s+precise/gi, 'visualization,\u00A0creating\u00A0precise')
}

function renderAccentMarkers(text: string) {
  return renderInlineAccentMarkers(keepSpecificPhrasesOnOneLine(text))
}

export function AboutPageContent({ className }: { className?: string }) {
  const { settings } = useSiteSettings()
  const aboutHero = settings.aboutHero
  if (!aboutHero.visible) return null

  return (
    <section
      className={cn(
        'pt-6 pb-8 sm:pt-8 sm:pb-12 md:pt-9 md:pb-14 lg:pt-10 lg:pb-16 xl:pt-12 xl:pb-20',
        className,
      )}
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-12 xl:gap-16 2xl:gap-20">
          <div className="min-w-0 max-w-184 lg:max-w-none lg:pr-4 xl:pr-8">
            <p className={landingSectionKickerClass}>
              <span className={landingSectionKickerDotClass} aria-hidden />
              {aboutHero.eyebrow}
            </p>
            <p className={cn('mt-5 text-pretty sm:mt-6 lg:mt-8', typeH1, 'text-lg sm:text-[1.125rem] md:text-[1.375rem] lg:text-[1.5rem] lg:leading-[1.32] xl:text-[1.7rem] xl:leading-[1.3]')}>
              {aboutHero.lines.map((line, idx) => (
                <span key={idx} className={cn('block', idx === 0 ? '' : 'mt-2 sm:mt-2.5 lg:mt-3')}>
                  {renderAccentMarkers(line)}
                </span>
              ))}
            </p>
          </div>

          <div className="relative mx-auto aspect-3/4 w-full max-w-54 overflow-hidden rounded-3xl sm:max-w-62 md:max-w-68 lg:mx-0 lg:w-full lg:max-w-76 lg:justify-self-end xl:max-w-[20rem] 2xl:max-w-xl 3xl:max-w-2xl 4xl:max-w-3xl xl:rounded-4xl">
            <Image
              src={aboutHero.portraitSrc}
              alt={aboutHero.portraitAlt}
              fill
              className="object-contain object-center"
              sizes="(max-width: 1024px) 90vw, 20rem"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
