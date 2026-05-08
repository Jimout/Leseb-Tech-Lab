'use client'

import { FluidSplitButton } from '@/components/fluid-split-button'
import { sectionKickerAccentClass, sectionKickerTextClass } from '@/lib/section-kicker-classes'
import { renderInlineAccentMarkers } from '@/lib/render-accent-markers'
import { cn } from '@/lib/utils'
import { useSiteSettings } from '@/hooks/use-site-settings'

export function HeroAboutIntro() {
  const { settings } = useSiteSettings()
  const hero = settings.hero
  return (
    <div
      id="about-intro"
      className={cn(
        'mt-8 grid min-w-0 w-full grid-cols-1 gap-8 sm:mt-10 sm:gap-10 lg:mt-12 lg:gap-10 xl:mt-14 xl:gap-12 2xl:mt-16 2xl:gap-14',
        'lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0 lg:items-start xl:gap-x-10 2xl:gap-x-12 3xl:gap-x-14',
      )}
    >
      <div className="flex items-center gap-2.5 lg:col-span-4 lg:row-start-1 lg:self-start">
        <span className="size-1.5 shrink-0 rounded-full bg-secondary dark:bg-accent" aria-hidden />
        <p className={cn(sectionKickerTextClass, 'leading-snug')}>
          {hero.whoAmIEyebrow}
        </p>
      </div>

      <div className="flex w-full flex-col items-stretch lg:col-span-8 lg:col-start-5 lg:row-start-1 lg:items-end">
        <div className="w-full max-w-full space-y-5 sm:space-y-6 lg:ml-auto lg:max-w-[min(42rem,100%)] lg:space-y-6 xl:max-w-[min(44rem,100%)] xl:space-y-7 2xl:max-w-[min(54rem,100%)] 2xl:space-y-8 3xl:max-w-[min(60rem,100%)] 4xl:max-w-[min(68rem,100%)]">
          <p className="indent-18 text-left text-base font-medium leading-relaxed text-foreground sm:indent-22 sm:text-lg sm:leading-relaxed lg:indent-30 lg:text-xl lg:leading-[1.6] xl:indent-36 xl:text-2xl xl:leading-[1.55] 2xl:indent-44 2xl:text-[1.7rem] 2xl:leading-[1.55] 3xl:indent-48 3xl:text-[1.82rem] 3xl:leading-[1.52] 4xl:indent-56 4xl:text-[1.94rem] 4xl:leading-normal">
            {renderInlineAccentMarkers(hero.whoAmIBody)}
          </p>
          <div className="flex justify-start">
            <FluidSplitButton label={hero.whoAmIButtonLabel} href={hero.whoAmIButtonHref} />
          </div>
        </div>
      </div>
    </div>
  )
}
