'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/layout/container'
import { FluidSplitButton } from '@/components/fluid-split-button'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { renderInlineAccentMarkers } from '@/lib/render-accent-markers'
import { cn } from '@/lib/utils'

function renderHeadlineWithAssociatedVenturesAccent(text: string) {
  const phrase = /Associated Ventures/gi
  const nodes: React.ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null

  while ((match = phrase.exec(text))) {
    if (match.index > last) nodes.push(...renderInlineAccentMarkers(text.slice(last, match.index)))
    nodes.push(
      <span key={`associated-ventures-${match.index}`} className="text-accent">
        {match[0]}
      </span>,
    )
    last = match.index + match[0].length
  }

  if (last < text.length) nodes.push(...renderInlineAccentMarkers(text.slice(last)))
  return nodes
}

export function AboutAssociatedVentures({ className }: { className?: string }) {
  const { settings } = useSiteSettings()
  const ventures = settings.aboutVentures
  if (!ventures.visible && !ventures.ctaVisible) return null
  const visibleLogos = ventures.logos.filter((l) => l.visible)
  const hasMoreThanThreeLogos = visibleLogos.length > 3
  const logoItemClass = hasMoreThanThreeLogos
    ? 'relative h-14 w-40 opacity-90 sm:h-16 sm:w-44 lg:h-20 lg:w-56 xl:h-24 xl:w-64 2xl:h-48 2xl:w-[36rem] 3xl:h-56 3xl:w-[42rem] 4xl:h-72 4xl:w-[52rem] -mx-2 sm:-mx-2.5 lg:-mx-3'
    : 'relative h-18 w-56 opacity-90 sm:h-21 sm:w-64 lg:h-26 lg:w-72 xl:h-32 xl:w-88 2xl:h-72 2xl:w-[50rem] 3xl:h-80 3xl:w-[58rem] 4xl:h-[28rem] 4xl:w-[70rem] -mx-3 sm:-mx-3.5 lg:-mx-4'

  return (
    <section className={cn('pt-2 pb-14 sm:pt-3 sm:pb-18 md:pt-4 md:pb-20 lg:pt-6 lg:pb-24 xl:pt-8 xl:pb-28', className)}>
      <Container>
        {ventures.visible ? (
          <div className="flex flex-col gap-10 overflow-x-clip lg:flex-row lg:items-center lg:justify-between lg:gap-12 xl:gap-16">
            <p className="max-w-none text-pretty text-base font-sans font-semibold leading-tight tracking-tight text-foreground sm:text-lg lg:max-w-[48ch] lg:text-[1.6rem] lg:leading-[1.22] xl:max-w-[52ch] xl:text-[1.85rem] xl:leading-[1.3] 2xl:text-[3.35rem] 2xl:leading-[1.14] 3xl:text-[4.35rem] 3xl:leading-[1.12] 4xl:text-[5.4rem] 4xl:leading-[1.1]">
              {ventures.headlineLines.map((line, idx) => (
                <span key={idx} className="block lg:whitespace-nowrap">
                  {renderHeadlineWithAssociatedVenturesAccent(line)}
                </span>
              ))}
            </p>

            <div className="w-full min-w-0 max-w-full overflow-hidden lg:ml-auto lg:w-auto lg:max-w-[min(100%,46rem)] 2xl:max-w-[min(100%,82rem)] 3xl:max-w-[min(100%,104rem)] 4xl:max-w-[min(100%,132rem)]">
              <div className="flex flex-nowrap items-center justify-end gap-0">
                {visibleLogos.map((logo) => (
                  <div key={logo.id} className={logoItemClass}>
                    {logo.href ? (
                      <Link
                        href={logo.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0"
                        aria-label={logo.alt}
                      >
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          fill
                          sizes="(max-width: 640px) 176px, (max-width: 1024px) 224px, (max-width: 1280px) 256px, (max-width: 1536px) 640px, (max-width: 1920px) 896px, (max-width: 2560px) 1152px, 1408px"
                          className="object-contain object-center"
                        />
                      </Link>
                    ) : (
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        sizes="(max-width: 640px) 176px, (max-width: 1024px) 224px, (max-width: 1280px) 256px, (max-width: 1536px) 640px, (max-width: 1920px) 896px, (max-width: 2560px) 1152px, 1408px"
                        className="object-contain object-center"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {ventures.ctaVisible ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-8 sm:mt-20 sm:gap-10 lg:mt-24">
            <h2 className="text-center text-balance text-2xl font-sans font-semibold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl xl:text-[2.75rem] xl:leading-[1.18] 2xl:text-[4.75rem] 2xl:leading-[1.08] 3xl:text-[6rem] 3xl:leading-[1.04] 4xl:text-[7.5rem] 4xl:leading-[1.02]">
              {ventures.ctaHeadingLines.map((line, idx) => (
                <span key={idx} className="block">
                  {renderInlineAccentMarkers(line)}
                </span>
              ))}
            </h2>
            <FluidSplitButton label={ventures.ctaButtonLabel} href={ventures.ctaHref} />
            <p className="pt-6 text-center text-[clamp(2.75rem,7.5vw,6.75rem)] font-sans font-semibold tracking-tight text-foreground 2xl:text-[10rem] 2xl:leading-none 3xl:text-[12rem] 3xl:leading-[0.97] 4xl:text-[14.5rem] 4xl:leading-[0.95]">
              {ventures.signatureName}
            </p>
          </div>
        ) : null}
      </Container>
    </section>
  )
}

