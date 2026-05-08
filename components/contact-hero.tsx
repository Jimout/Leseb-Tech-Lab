import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownRight, Play } from 'lucide-react'

import { sectionKickerAccentClass } from '@/lib/section-kicker-classes'
import { cn } from '@/lib/utils'

const HERO_IMG =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'

export function ContactHero({ className }: { className?: string }) {
  return (
    <section className={cn('pt-6 sm:pt-8 md:pt-10 lg:pt-12', className)}>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <div className="min-w-0 max-w-3xl flex-1 2xl:max-w-none 3xl:max-w-none 4xl:max-w-none">
          <p className={cn('flex items-center gap-2 text-sm font-medium sm:text-[15px]', sectionKickerAccentClass)}>
            <span className="size-1.5 shrink-0 rounded-full bg-secondary dark:bg-accent" aria-hidden />
            Contact
          </p>
          <div className="mt-4 sm:mt-5 lg:mt-6">
            <h1 className="text-balance text-[2rem] font-bold leading-[1.1] tracking-tight text-foreground sm:text-[2.375rem] md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem] 2xl:text-[7.4rem] 2xl:leading-none 3xl:text-[9.4rem] 3xl:leading-none 4xl:text-[11.6rem] 4xl:leading-none">
              <span className="block">It&apos;s nice to meet</span>
              <span className="mt-1 flex flex-wrap items-center gap-3 sm:mt-2 sm:gap-4 md:gap-5">
                <span>you</span>
                <Link
                  href="#contact-form"
                  className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-accent dark:text-accent-foreground dark:focus-visible:ring-accent sm:size-14 md:size-15 2xl:size-31 3xl:size-38 4xl:size-46"
                  aria-label="Jump to contact form"
                >
                  <ArrowDownRight className="size-5 sm:size-6 md:size-7 2xl:size-15 3xl:size-20 4xl:size-24" strokeWidth={1.1} aria-hidden />
                </Link>
              </span>
            </h1>
          </div>
        </div>

        <div className="relative w-full shrink-0 overflow-hidden rounded-2xl sm:max-w-md lg:max-w-[min(42vw,24rem)] lg:pt-1 xl:max-w-104 2xl:max-w-[min(56vw,40rem)] 3xl:max-w-[min(60vw,48rem)] 4xl:max-w-[min(64vw,56rem)]">
          <div className="relative aspect-4/3 w-full sm:aspect-5/4 2xl:aspect-6/5 3xl:aspect-11/9 4xl:aspect-5/4">
            <Image
              src={HERO_IMG}
              alt="Modern residence in a wooded setting"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 24rem"
              priority
            />
            <button
              type="button"
              className="absolute bottom-3 right-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-accent dark:text-accent-foreground dark:focus-visible:ring-ring sm:bottom-4 sm:right-4 sm:size-12"
              aria-label="Play video"
            >
              <Play className="ml-0.5 size-5 fill-current sm:size-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 h-px w-full bg-accent sm:mt-12 md:mt-14 lg:mt-16" aria-hidden />
    </section>
  )
}
