import { MediaRenderer } from '@/components/media-renderer'
import type { MediaAsset } from '@/lib/media-assets'
import { cn } from '@/lib/utils'

function HeroCoverImg({ media, className, sizes }: { media: MediaAsset; className?: string; sizes: string }) {
  return (
    <MediaRenderer
      media={media}
      className={cn('absolute inset-0 size-full object-cover object-center', className)}
      sizes={sizes}
      controls={false}
      autoplay={false}
    />
  )
}

export type InsightDetailHeroProps = {
  title: string
  date: string
  dateIso: string
  heroMedia: MediaAsset | null
}

/** Tight vertical inset so the desktop hero image fills most of the band. */
const heroInsetImageDesktop = cn(
  'top-1 bottom-1 sm:top-2 sm:bottom-2 lg:top-0 lg:bottom-0 xl:top-1 xl:bottom-1 2xl:top-2 2xl:bottom-2',
)
const radiusImg = cn('rounded-xl sm:rounded-2xl lg:rounded-[1.125rem] xl:rounded-[1.25rem] 2xl:rounded-[1.375rem]')
/** Desktop hero image: flush right edge — radius only on left. */
const radiusImgDesktop = cn(
  'rounded-l-xl rounded-r-none sm:rounded-l-2xl sm:rounded-r-none',
  'lg:rounded-l-[1.125rem] lg:rounded-r-none xl:rounded-l-[1.25rem] xl:rounded-r-none',
  '2xl:rounded-l-[1.375rem] 2xl:rounded-r-none',
)
const radiusPanel = cn(
  'rounded-r-xl sm:rounded-r-2xl lg:rounded-r-[1.125rem] xl:rounded-r-[1.25rem] 2xl:rounded-r-[1.375rem]',
)

/** Match `radiusImgDesktop` on the Next/Image fill layer so the photo clips at the panel junction. */
const radiusImgDesktopImage = cn(
  'rounded-l-xl rounded-r-none sm:rounded-l-2xl sm:rounded-r-none',
  'lg:rounded-l-[1.125rem] lg:rounded-r-none xl:rounded-l-[1.25rem] xl:rounded-r-none',
  '2xl:rounded-l-[1.375rem] 2xl:rounded-r-none',
)

/** Keeps text before the first `:` on a single line (e.g. "Biomimicry Architecture:"). */
function InsightDetailHeroTitle({ title, className }: { title: string; className: string }) {
  const i = title.indexOf(':')
  if (i === -1) {
    return (
      <h1 className={cn(className, 'text-balance')}>
        {title}
      </h1>
    )
  }
  const head = title.slice(0, i + 1)
  const tail = title.slice(i + 1).trimStart()
  return (
    <h1 className={className}>
      <span className="whitespace-nowrap">{head}</span>
      {tail ? <span className="wrap-break-word"> {tail}</span> : null}
    </h1>
  )
}

function InsightHeroMobile(props: InsightDetailHeroProps) {
  const { title, date, dateIso, heroMedia } = props
  const hasCover = Boolean(heroMedia?.url?.trim())
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:hidden">
      <div className={cn('overflow-hidden', radiusImg)}>
        <div className="relative aspect-4/3 w-full">
          {hasCover ? (
            <HeroCoverImg media={heroMedia} sizes="100vw" />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center bg-muted/35"
              aria-hidden
            >
              <span className="text-xs text-muted-foreground">No cover image</span>
            </div>
          )}
        </div>
        <div className="bg-page-grid px-5 py-5 sm:px-6 sm:py-6">
          <time dateTime={dateIso} className="text-xs text-muted-foreground sm:text-sm">
            {date}
          </time>
          <InsightDetailHeroTitle
            title={title}
            className="mt-3 text-2xl font-bold leading-[1.15] tracking-tight text-foreground sm:mt-4 sm:text-3xl"
          />
        </div>
      </div>
    </div>
  )
}

function DesktopHeroImage({ heroMedia }: Pick<InsightDetailHeroProps, 'heroMedia'>) {
  const hasCover = Boolean(heroMedia?.url?.trim())
  return (
    <div
      className={cn(
        'absolute z-0 overflow-hidden',
        heroInsetImageDesktop,
        radiusImgDesktop,
        'right-0',
        'left-[28%] sm:left-[30%] lg:left-[34%] xl:left-[36%] 2xl:left-[38%]',
      )}
    >
      {hasCover ? (
        <HeroCoverImg
          media={heroMedia}
          className={radiusImgDesktopImage}
          sizes="(max-width: 1536px) 65vw, 60vw"
        />
      ) : (
        <div
          className={cn(
            'flex size-full min-h-[min(60vh,520px)] items-center justify-center bg-muted/30',
            radiusImgDesktopImage,
          )}
          aria-hidden
        >
          <span className="text-sm text-muted-foreground">No cover image</span>
        </div>
      )}
    </div>
  )
}

function DesktopHeroPanel({ title, date, dateIso }: Pick<InsightDetailHeroProps, 'title' | 'date' | 'dateIso'>) {
  return (
    <div
      className={cn(
        'absolute z-20 top-17 w-[min(100%,26rem)] max-w-[min(26rem,calc(50%-0.5rem))] sm:top-20 lg:top-24 xl:top-28',
        'left-16 sm:left-20 sm:max-w-[min(30rem,calc(48%-0.5rem))]',
        'lg:left-40 lg:w-[min(100%,32rem)] lg:max-w-[min(32rem,46%)] xl:left-44 xl:max-w-[min(34rem,44%)]',
        '2xl:left-48 2xl:max-w-[min(38rem,46%)] 3xl:left-52 3xl:max-w-[min(40rem,44%)] 4xl:left-56',
        radiusPanel,
        'bg-page-grid py-5 pl-3 pr-7 sm:py-5 sm:pl-4 sm:pr-8',
        'lg:py-6 lg:pl-5 lg:pr-9 xl:py-6 xl:pr-10 2xl:py-7 2xl:pr-11',
      )}
    >
      <div className="pointer-events-auto w-full">
        <time dateTime={dateIso} className="text-xs text-muted-foreground sm:text-sm">
          {date}
        </time>
        <InsightDetailHeroTitle
          title={title}
          className={cn(
            'mt-2 text-2xl font-bold leading-[1.15] tracking-tight text-foreground sm:mt-2.5 sm:text-3xl',
            'lg:text-[1.75rem] lg:leading-[1.12] lg:mt-2 xl:text-4xl 2xl:text-[2.25rem] 3xl:text-[2.4rem]',
          )}
        />
      </div>
    </div>
  )
}

function InsightHeroDesktop(props: InsightDetailHeroProps) {
  return (
    <div
      className={cn(
        'relative hidden min-h-[min(96vh,1180px)] w-full lg:block',
        'lg:min-h-[min(100vh,1360px)] xl:min-h-[min(100vh,1520px)] 2xl:min-h-[min(100vh,1680px)]',
      )}
    >
      <DesktopHeroImage heroMedia={props.heroMedia} />
      <DesktopHeroPanel title={props.title} date={props.date} dateIso={props.dateIso} />
    </div>
  )
}

export function InsightDetailHero(props: InsightDetailHeroProps) {
  return (
    <header className="relative w-full overflow-x-hidden">
      <InsightHeroMobile {...props} />
      <InsightHeroDesktop {...props} />
    </header>
  )
}
