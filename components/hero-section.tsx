'use client'

import Image from 'next/image'
import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'

import { useSiteSettings } from '@/hooks/use-site-settings'
import { landingPageContentMaxClass, landingPageGutterClass } from '@/lib/landing-page-layout'
import { cn } from '@/lib/utils'

export function HeroSection() {
  const { settings } = useSiteSettings()
  const hero = settings.hero

  return (
    <section
      data-nav-surface="light"
      className={cn(
        'relative min-w-0 overflow-x-clip overflow-y-hidden',
        'pt-12 sm:pt-14 md:pt-16 lg:pt-16 xl:pt-20 2xl:pt-24 3xl:pt-28 4xl:pt-32',
        'pb-0',
        landingPageGutterClass,
      )}
    >
      <div className={cn('relative', landingPageContentMaxClass)}>
        {/* glowing mark */}
        <Image
          src="/icon.svg"
          alt="Leseb mark"
          width={512}
          height={512}
          className="absolute -top-6 right-0 md:right-10 w-40 sm:w-44 md:w-56 lg:w-64 xl:w-72 2xl:w-80 3xl:w-96 opacity-90 animate-float pointer-events-none"
          priority
        />

        <p className="font-mono text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.3em] text-signal mb-6 sm:mb-7 md:mb-8 lg:mb-9 xl:mb-10 animate-fade-up">
          (ለሰብ) &nbsp; / &nbsp; for humans
        </p>

        <h1
          className={
            'font-display font-medium tracking-[-0.04em] text-balance animate-fade-up ' +
            'leading-[0.92] ' +
            'text-[2.2rem] sm:text-[2.6rem] md:text-[3.1rem] lg:text-[3.8rem] xl:text-[4.6rem] ' +
            '2xl:text-[6rem] 3xl:text-[7rem] 4xl:text-[8rem]'
          }
          style={{ animationDelay: '80ms' }}
        >
          Technology
          <br />
          built <span className="italic font-light text-signal">for humans.</span>
        </h1>

        <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 xl:mt-16 2xl:mt-20 3xl:mt-24 4xl:mt-28 grid min-w-0 grid-cols-1 items-end gap-8 sm:gap-10 md:grid-cols-12 lg:gap-12 2xl:gap-14 3xl:gap-16">
          <div className="min-w-0 md:col-span-5 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-3 sm:mb-4 md:mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> What is Leseb?
            </div>
            <p className="text-base sm:text-lg md:text-xl xl:text-2xl 2xl:text-[1.7rem] 3xl:text-[1.85rem] 4xl:text-[2rem] text-foreground/80 leading-relaxed text-balance">
              <span className="text-foreground">Leseb (ለሰብ)</span> in Ge&apos;ez means{' '}
              <em className="text-signal not-italic">&quot;for humans&quot;</em> — and that is the foundation of our
              identity. We design AI and software that serve people, never overwhelm them.
            </p>

            <a
              href={hero.whoAmIButtonHref || '#manifesto'}
              className="group mt-6 sm:mt-7 md:mt-8 inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground pl-6 pr-2 py-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] hover:scale-[1.03] transition-transform"
            >
              Read the Manifesto
              <span className="grid place-items-center w-8 h-8 rounded-full bg-primary-foreground/10 group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </a>
          </div>

          <div
            className="min-w-0 text-left md:col-span-4 md:col-start-9 md:text-right animate-fade-up"
            style={{ animationDelay: '320ms' }}
          >
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-signal mb-2">
              Tech Lab · Est. 2025
            </p>
            <p className="font-mono text-[11px] sm:text-xs md:text-sm text-muted-foreground leading-relaxed">
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
