import Image from 'next/image'

import { containerPaddingClass } from '@/components/layout/container'
import { NewsletterForm } from '@/components/newsletter-form'
import { cn } from '@/lib/utils'

const logoDarkSrc = '/images/newspaper%201.png'
const logoLightSrc = '/images/newspaper%202.png'

export type NewsletterSubscribeBannerProps = {
  className?: string
  kicker?: string
  heading?: string
  placeholder?: string
}

function HeadingLines({ text }: { text: string }) {
  const lower = text.toLowerCase()

  // Special-case the main newsletter heading: two lines like the reference.
  const upToIdx = lower.indexOf(' up to ')
  if (upToIdx >= 0 && lower.includes('date insights')) {
    const line1 = text.slice(0, upToIdx + ' up to'.length).trim()
    const line2 = text.slice(upToIdx + ' up to'.length).trim()
    return (
      <>
        <span className="block lg:whitespace-nowrap">{line1}</span>
        <span className="block lg:whitespace-nowrap">{line2}</span>
      </>
    )
  }

  const insightsIdx = lower.lastIndexOf(' insights')
  if (insightsIdx >= 0) {
    const line1 = text.slice(0, insightsIdx).trim()
    const line2 = text.slice(insightsIdx).trim()
    return (
      <>
        <span className="block lg:whitespace-nowrap">{line1}</span>
        <span className="block lg:whitespace-nowrap">{line2}</span>
      </>
    )
  }

  return text
}

export function NewsletterSubscribeBanner({
  className,
  kicker = 'Spam Free Newsletter',
  heading = 'Receive the most up to date insights',
  placeholder = 'Your Email',
}: NewsletterSubscribeBannerProps) {
  return (
    <section
      className={cn('w-full', className)}
      aria-labelledby="newsletter-subscribe-banner-heading"
    >
      <div className={cn('mx-auto w-full max-w-none', containerPaddingClass)}>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1B] shadow-sm sm:rounded-3xl">
          <div className="flex flex-col gap-10 p-8 sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:gap-14 lg:p-12 xl:gap-16 xl:p-14 2xl:gap-16 2xl:p-16">
            <div className="min-w-0 flex-1 space-y-5 lg:space-y-6">
              <p className="flex items-center gap-2.5 text-sm font-semibold text-accent sm:text-base">
                <span className="size-2 shrink-0 rounded-full bg-accent" aria-hidden />
                {kicker}
              </p>
              <h2
                id="newsletter-subscribe-banner-heading"
                className="text-balance text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.625rem] lg:leading-[1.08] xl:text-5xl 2xl:text-6xl"
              >
                <HeadingLines text={heading} />
              </h2>
              <NewsletterForm
                buttonVariant="outline"
                formClassName="w-full max-w-full flex-col gap-3 sm:flex-row sm:items-stretch lg:max-w-3xl xl:max-w-4xl"
                inputClassName={cn(
                  'h-12 rounded-full border border-white bg-transparent px-5 text-sm text-white',
                  'placeholder:text-muted-foreground',
                  'focus-visible:border-white focus-visible:ring-white/30',
                )}
                buttonClassName={cn(
                  'h-12 shrink-0 rounded-full border border-white bg-transparent px-8 text-sm font-semibold text-white',
                  'hover:bg-white/10',
                  'md:px-10',
                )}
                placeholder={placeholder}
              />
            </div>

            <div className="flex w-full max-w-[min(100%,34rem)] items-end justify-end lg:ml-auto lg:w-[min(100%,34rem)] lg:translate-y-10 xl:translate-y-12 2xl:translate-y-14">
              <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 xl:h-56 xl:w-56 2xl:h-60 2xl:w-60">
                <Image
                  src={logoLightSrc}
                  alt=""
                  fill
                  sizes="240px"
                  className="object-contain object-center dark:hidden"
                />
                <Image
                  src={logoDarkSrc}
                  alt=""
                  fill
                  sizes="240px"
                  className="hidden object-contain object-center dark:block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
