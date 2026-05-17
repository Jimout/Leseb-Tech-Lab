'use client'

import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'

import { useSiteSettings } from '@/hooks/use-site-settings'
import {
  landingHeroPadTopClass,
  landingPageGutterClass,
  landingSectionInnerClass,
} from '@/lib/landing-page-layout'
import {
  landingHeroAsideKickerClass,
  landingHeroBodyClass,
  landingHeroEyebrowClass,
  landingHeroSubkickerClass,
  landingSectionKickerDotClass,
  landingHeroTitleClass,
  landingMetaClass,
  landingSectionTitleAccentClass,
} from '@/lib/landing-page-typography'
import { renderInlineAccentMarkers } from '@/lib/render-accent-markers'
import { cn } from '@/lib/utils'

export function HeroSection() {
  const { settings } = useSiteSettings()
  const hero = settings.hero
  const asideLines = hero.roleLine2.split('\n').map((line) => line.trim()).filter(Boolean)

  return (
    <section
      data-nav-surface="dark"
      className={cn(
        'relative -mt-14 min-h-dvh min-w-0 overflow-x-clip overflow-y-hidden bg-background py-0 2xl:min-h-0',
        landingPageGutterClass,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade" aria-hidden />
      <div className="pointer-events-none absolute inset-0 hero-teal-glow" aria-hidden />

      <div
        className={cn(
          landingSectionInnerClass,
          landingHeroPadTopClass,
          'pb-0',
        )}
      >
        <p className={cn(landingHeroEyebrowClass, 'animate-fade-up')}>{hero.eyebrow}</p>

        <h1 className={cn(landingHeroTitleClass, 'animate-fade-up')} style={{ animationDelay: '80ms' }}>
          {hero.nameLine1}
          <br />
          {hero.nameLine2}
          <span className={landingSectionTitleAccentClass}>{hero.titleAccent}</span>
        </h1>

        <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 xl:mt-16 2xl:mt-20 3xl:mt-24 4xl:mt-28 grid min-w-0 grid-cols-1 items-end gap-8 sm:gap-10 md:grid-cols-12 lg:gap-12 2xl:gap-14">
          <div className="min-w-0 md:col-span-5 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className={landingHeroSubkickerClass}>
              <span className={landingSectionKickerDotClass} aria-hidden /> {hero.whoAmIEyebrow}
            </div>
            <p className={landingHeroBodyClass}>{renderInlineAccentMarkers(hero.whoAmIBody)}</p>

            <a
              href={hero.whoAmIButtonHref || '#manifesto'}
              className="group mt-6 sm:mt-7 md:mt-8 inline-flex items-center gap-3 rounded-full bg-signal text-secondary-foreground pl-6 pr-2 py-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] hover:scale-[1.03] transition-transform"
            >
              {hero.whoAmIButtonLabel}
              <span className="grid place-items-center w-8 h-8 rounded-full bg-secondary-foreground/10 group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </a>
          </div>

          <div
            className="min-w-0 text-left md:col-span-4 md:col-start-9 md:text-right animate-fade-up"
            style={{ animationDelay: '320ms' }}
          >
            <p className={landingHeroAsideKickerClass}>{hero.roleLine1}</p>
            <p className={cn(landingMetaClass, 'leading-relaxed')}>
              {asideLines.map((line, index) => (
                <React.Fragment key={`${line}-${index}`}>
                  {index > 0 ? <br /> : null}
                  {line}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
