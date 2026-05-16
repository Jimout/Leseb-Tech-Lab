'use client'

import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'

import { useSiteSettings } from '@/hooks/use-site-settings'
import {
  landingHeroPadTopClass,
  landingPageGutterClass,
  landingSectionInnerClass,
  landingSectionPadBottomClass,
} from '@/lib/landing-page-layout'
import {
  landingHeroAsideKickerClass,
  landingHeroBodyClass,
  landingHeroEyebrowClass,
  landingHeroSubkickerClass,
  landingHeroTitleClass,
  landingMetaClass,
  landingSectionTitleAccentClass,
} from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'

export function HeroSection() {
  const { settings } = useSiteSettings()
  const hero = settings.hero

  return (
    <section
      data-nav-surface="dark"
      className={cn(
        'relative -mt-14 min-h-dvh min-w-0 overflow-x-clip overflow-y-hidden bg-background py-0',
        landingPageGutterClass,
      )}
    >
      {/* Grid pattern with elliptical fade */}
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade" aria-hidden />
      {/* Radial teal glow at top */}
      <div className="pointer-events-none absolute inset-0 hero-teal-glow" aria-hidden />

      <div
        className={cn(
          landingSectionInnerClass,
          landingHeroPadTopClass,
          landingSectionPadBottomClass,
        )}
      >
        {/* Hero video — temporarily disabled
        <div
          className="pointer-events-none absolute -top-14 right-[3%] hidden md:block w-[68%] lg:w-[65%] xl:w-[62%] 2xl:w-[58%] aspect-video overflow-hidden rounded-3xl hero-video-blend"
          aria-hidden
        >
          <video
            src="/0001-0120.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover object-center"
          />
        </div>
        */}
        <p className={cn(landingHeroEyebrowClass, 'animate-fade-up')}>
          (ለሰብ) &nbsp; / &nbsp; for humans
        </p>

        <h1 className={cn(landingHeroTitleClass, 'animate-fade-up')} style={{ animationDelay: '80ms' }}>
          Technology
          <br />
          built <span className={landingSectionTitleAccentClass}>for humans.</span>
        </h1>

        <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 xl:mt-16 2xl:mt-20 3xl:mt-24 4xl:mt-28 grid min-w-0 grid-cols-1 items-end gap-8 sm:gap-10 md:grid-cols-12 lg:gap-12 2xl:gap-14 3xl:gap-16">
          <div className="min-w-0 md:col-span-5 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className={landingHeroSubkickerClass}>
              <span className="size-1.5 shrink-0 rounded-full bg-signal" aria-hidden /> What is Leseb?
            </div>
            <p className={landingHeroBodyClass}>
              <span className="text-foreground">Leseb (ለሰብ)</span> in Ge&apos;ez means{' '}
              <em className="text-signal not-italic">&quot;for humans&quot;</em> and that is the foundation of our
              identity. We design AI and software that serve people, never overwhelm them.
            </p>

            <a
              href={hero.whoAmIButtonHref || '#manifesto'}
              className="group mt-6 sm:mt-7 md:mt-8 inline-flex items-center gap-3 rounded-full bg-signal text-secondary-foreground pl-6 pr-2 py-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] hover:scale-[1.03] transition-transform"
            >
              Read the Manifesto
              <span className="grid place-items-center w-8 h-8 rounded-full bg-secondary-foreground/10 group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </a>
          </div>

          <div
            className="min-w-0 text-left md:col-span-4 md:col-start-9 md:text-right animate-fade-up"
            style={{ animationDelay: '320ms' }}
          >
            <p className={landingHeroAsideKickerClass}>Tech Lab · Est. 2025</p>
            <p className={cn(landingMetaClass, 'leading-relaxed')}>
              Building human-centered AI
              <br />
              from Addis Ababa to the world.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}


