import Image from 'next/image'

import humanAi from '@/assets/human-ai.jpg'
import { landingPageContentMaxClass, landingPageGutterClass } from '@/lib/landing-page-layout'
import { cn } from '@/lib/utils'

export const Manifesto = () => (
  <section
    id="manifesto"
    data-nav-surface="dark"
    className={cn('relative min-w-0 overflow-x-clip bg-black py-0 text-white', landingPageGutterClass)}
  >
    <div
      className={cn(
        'mx-auto grid min-w-0 gap-12 py-16 md:grid-cols-12 md:gap-14 md:py-24 lg:gap-16 lg:py-28 xl:py-32 2xl:gap-20 3xl:gap-24',
        landingPageContentMaxClass,
      )}
    >
      <div className="md:col-span-3">
        <div className="md:sticky md:top-32">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-signal">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Manifesto
          </div>
          <p className="mt-4 font-mono text-xs text-white/55">01 to 03</p>
        </div>
      </div>

      <div className="min-w-0 space-y-12 sm:space-y-14 md:col-span-9 md:space-y-16 lg:space-y-20 2xl:space-y-24">
        <p className="font-display text-balance text-3xl leading-[1.15] tracking-tight text-white md:text-5xl lg:text-6xl 2xl:text-7xl 3xl:text-8xl">
          We founded <span className="text-signal">Leseb Tech Lab</span> because we believe technology should
          <em className="font-light italic"> serve people</em>, not overwhelm them.
        </p>

        <div className="grid min-w-0 items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-14 2xl:gap-16">
          <div className="relative aspect-4/5 min-h-0 min-w-0 overflow-hidden rounded-3xl bg-[#0b0b0b]">
            <Image
              src={humanAi}
              alt="Human silhouette merging with AI light streams"
              fill
              sizes="(min-width: 768px) 38vw, 90vw"
              className="object-cover opacity-70"
              placeholder="blur"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">
              02 Human × Machine
            </div>
          </div>

          <div className="min-w-0">
            <p className="font-display text-balance text-2xl leading-snug tracking-tight text-white/90 md:text-3xl lg:text-4xl 2xl:text-5xl">
              At Leseb Tech Lab, we believe that <span className="text-signal">social change is not optional</span>.
              It&apos;s necessary.
            </p>
            <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg 2xl:text-xl">
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
