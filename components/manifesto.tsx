import Image from 'next/image'

import humanAi from '@/assets/human-ai.jpg'
import {
  landingPageContentMaxClass,
  landingPageGutterClass,
} from '@/lib/landing-page-layout'
import {
  landingBandClass,
  landingBodyClass,
  landingCaptionClass,
  landingManifestoAsideClass,
  landingManifestoAsideTitleClass,
  landingManifestoBodyClass,
  landingManifestoGridClass,
  landingManifestoLeadClass,
  landingSectionKickerClass,
  landingSectionKickerDotClass,
} from '@/lib/landing-page-typography'
import { cn } from '@/lib/utils'

export const Manifesto = () => (
  <section
    id="manifesto"
    data-nav-surface="dark"
    className={cn('relative min-w-0 overflow-x-clip py-0', landingBandClass, landingPageGutterClass)}
  >
    <div
      className={cn(landingManifestoGridClass, landingPageContentMaxClass)}
    >
      <div className={landingManifestoAsideClass}>
        <div className="md:sticky md:top-32">
          <div className={landingSectionKickerClass}>
            <span className={landingSectionKickerDotClass} aria-hidden /> Manifesto
          </div>
        </div>
      </div>

      <div className={landingManifestoBodyClass}>
        <p className={landingManifestoLeadClass}>
          We founded <span className="text-signal">Leseb Tech Lab</span> because we believe technology should
          <em className="font-light italic"> serve people</em>, not overwhelm them.
        </p>

        <div className="grid min-w-0 items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-14 2xl:gap-16">
          <div className="relative aspect-4/5 min-h-0 min-w-0 overflow-hidden rounded-3xl bg-box">
            <Image
              src={humanAi}
              alt="Human silhouette merging with AI light streams"
              fill
              sizes="(min-width: 768px) 38vw, 90vw"
              className="object-cover opacity-70"
              placeholder="blur"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/25 to-transparent" />
            <div className={cn('absolute bottom-6 left-6', landingCaptionClass)}>
              Human × Machine
            </div>
          </div>

          <div className="min-w-0">
            <p className={landingManifestoAsideTitleClass}>
              At Leseb Tech Lab, we believe that <span className="text-signal">social change is not optional</span>.
              It&apos;s necessary.
            </p>
            <p className={cn('mt-6', landingBodyClass)}>
              Every product we ship is a small contract with the people who use it: that it will respect their time,
              their context, and their dignity. We work in the open, build with care, and let the human stay at the
              center of the system.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
)
