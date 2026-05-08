'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'

import { Container } from '@/components/layout/container'
import { FluidSplitButton } from '@/components/fluid-split-button'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { cn } from '@/lib/utils'

/** Line center is half the track; dot aligns to −(track + gap) + half track from content column start. */
const TRACK_W = 'w-10'
const GAP = 'gap-6'
const DOT_OFFSET = '-left-11'

/** Same font weight on all breakpoints for journey list titles (no `sm:font-*` / `lg:font-*`). */
const journeyListTitleWeight = 'font-medium'

/** Role, journey detail italics, toolkit labels — one step smaller at every breakpoint */
const journeyAccentMetaClass =
  'text-xs italic sm:text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base 3xl:text-base 4xl:text-lg'

/** Primary line above accent detail (institution / role title) — same scale down */
const journeyPrimaryLineClass =
  'text-xs sm:text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base 3xl:text-base 4xl:text-lg'

type EducationItem = { id: string; title: string; detail: string }

type ExperienceItem = { id: string; title: string; detail: string; description: string }

type CertificationItem = { id: string; title: string; detail: string }

function TimelineTrack() {
  return (
    <div
      className={cn('flex shrink-0 flex-col items-center self-stretch', TRACK_W)}
      aria-hidden
    >
      {/* In-flow flex child so the line height grows with the content column (absolute-only tracks collapse). */}
      <div className="w-px min-h-0 flex-1 rounded-full bg-foreground/35 dark:bg-white/85 md:w-0.5" />
    </div>
  )
}

function TimelineDot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'absolute z-1 size-3 -translate-x-1/2 rounded-full border-2 border-background bg-secondary dark:bg-accent md:size-3.5',
        DOT_OFFSET,
        className,
      )}
      aria-hidden
    />
  )
}

function EducationSection({ items }: { items: EducationItem[] }) {
  return (
    <div className="relative">
      <TimelineDot className="top-2.5" />
      <h3 className="text-sm font-bold tracking-tight text-foreground sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">
        Education
      </h3>
      <ul className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">
        {items.map((item) => (
          <li key={item.id}>
            <p className={cn(journeyListTitleWeight, 'text-foreground', journeyPrimaryLineClass)}>
              {item.title}
            </p>
            <p className={cn('mt-1 text-accent', journeyAccentMetaClass)}>{item.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ExperienceSection({ items }: { items: ExperienceItem[] }) {
  return (
    <div className="relative">
      <TimelineDot className="top-2.5" />
      <h3 className="text-sm font-bold tracking-tight text-foreground sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">
        Professional Experience
      </h3>
      <ul className="mt-8 space-y-12 sm:mt-10 sm:space-y-14">
        {items.map((item) => (
          <li key={item.id}>
            <p
              className={cn(
                journeyListTitleWeight,
                'leading-relaxed tracking-tight text-foreground',
                journeyPrimaryLineClass,
              )}
            >
              {item.title}
            </p>
            <p className={cn('mt-1.5 text-accent', journeyAccentMetaClass)}>{item.detail}</p>
            <p className="mt-4 max-w-none text-pretty text-sm leading-relaxed text-foreground/90 sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-lg 3xl:text-lg 4xl:text-xl">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CertificationsSection({ items }: { items: CertificationItem[] }) {
  return (
    <div className="relative">
      <TimelineDot className="top-2.5" />
      <h3 className="text-sm font-bold tracking-tight text-foreground sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">
        Certifications
      </h3>
      <ul className="mt-6 space-y-4 sm:mt-7 sm:space-y-5">
        {items.map((item) => (
          <li key={item.id}>
            <p className={cn(journeyListTitleWeight, 'text-foreground', journeyPrimaryLineClass)}>
              {item.title}
            </p>
            <p className={cn('mt-1 text-accent', journeyAccentMetaClass)}>{item.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ToolkitSection() {
  const { settings } = useSiteSettings()
  const toolkit = settings.aboutJourney
  const sections =
    toolkit.toolkitSections?.length
      ? toolkit.toolkitSections
      : [
          { id: 'toolkit-design', visible: true, label: 'Design', icons: toolkit.toolkitDesign },
          {
            id: 'toolkit-visualization',
            visible: true,
            label: 'Visualization',
            icons: toolkit.toolkitVisualization,
          },
          { id: 'toolkit-graphics', visible: true, label: 'Graphics', icons: toolkit.toolkitGraphics },
          { id: 'toolkit-media', visible: true, label: 'Media', icons: toolkit.toolkitMedia },
        ]
  const visibleSections = sections
    .filter((section) => section.visible)
    .map((section) => ({
      ...section,
      icons: section.icons.filter((icon) => icon.visible),
    }))
    .filter((section) => section.icons.length > 0)

  return (
    <div className="relative">
      <TimelineDot className="top-2.5" />
      <h3 className="text-sm font-bold tracking-tight text-foreground sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">
        Toolkit
      </h3>
      <div className="mt-6 space-y-7 sm:space-y-8">
        {visibleSections.map((section) => (
          <div key={section.id}>
            <p className={cn('text-accent', journeyAccentMetaClass)}>{section.label}</p>
            <div className="mt-4 flex flex-wrap items-center gap-6 sm:gap-7">
              {section.icons.map((tool) => (
                <div
                  key={tool.id}
                  className="relative h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 2xl:h-10 2xl:w-10 3xl:h-11 3xl:w-11 4xl:h-12 4xl:w-12"
                >
                  <Image
                    src={tool.src}
                    alt={tool.alt}
                    fill
                    sizes="(max-width: 768px) 32px, (max-width: 1536px) 40px, 48px"
                    className="object-contain object-center"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TimelineColumn({ children }: { children: ReactNode }) {
  return (
    <div className={cn('flex min-w-0 items-stretch', GAP)}>
      <TimelineTrack />
      <div className="min-w-0 flex-1 space-y-14 sm:space-y-16">{children}</div>
    </div>
  )
}

export function AboutProfessionalJourney({ className }: { className?: string }) {
  const { settings } = useSiteSettings()
  const journey = settings.aboutJourney
  if (!journey.visible) return null

  const education: EducationItem[] = journey.educationVisible
    ? journey.education.filter((x) => x.visible).map((x) => ({ id: x.id, title: x.title, detail: x.detail }))
    : []
  const experience: ExperienceItem[] = journey.experienceVisible
    ? journey.experience
        .filter((x) => x.visible)
        .map((x) => ({
          id: x.id,
          title: x.title,
          detail: x.detail,
          description: x.description ?? '',
        }))
    : []
  const certifications: CertificationItem[] = journey.certificationsVisible
    ? journey.certifications.filter((x) => x.visible).map((x) => ({ id: x.id, title: x.title, detail: x.detail }))
    : []

  return (
    <section
      className={cn(
        'pb-14 pt-0 sm:pb-20 sm:pt-0 md:pb-24 md:pt-0 lg:pb-28 lg:pt-0',
        className,
      )}
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-14 xl:gap-20">
          <div className="min-w-0 lg:max-w-none lg:pr-4 xl:pr-6 2xl:pr-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-[1.75rem] xl:text-4xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl">
              {journey.headingName}
            </h2>
            <p className={cn('mt-2 text-accent', journeyAccentMetaClass)}>{journey.headingRole}</p>
            <p className="mt-12 max-w-none text-pretty text-sm leading-relaxed text-foreground sm:mt-14 sm:text-base lg:mt-16 lg:text-[1.05rem] xl:text-lg 2xl:text-xl 3xl:text-xl 4xl:text-2xl">
              {journey.intro}
            </p>
            <div className="mt-12 sm:mt-14 lg:mt-16">
              <FluidSplitButton label="Download CV" href={journey.cvHref} size="sm" download />
            </div>
          </div>

          <TimelineColumn>
            {journey.educationVisible ? <EducationSection items={education} /> : null}
            {journey.experienceVisible ? <ExperienceSection items={experience} /> : null}
            {journey.certificationsVisible ? <CertificationsSection items={certifications} /> : null}
            {journey.toolkitVisible ? <ToolkitSection /> : null}
          </TimelineColumn>
        </div>
      </Container>
    </section>
  )
}
