import { Container, containerMaxWidthClass, containerPaddingClass } from '@/components/layout/container'
import { WorkDetailContentBlocks } from '@/components/work-detail-content-blocks'
import { WorkDetailFillImage } from '@/components/work-detail-fill-image'
import { WorkDetailHero, workDetailMainImageHeightClass } from '@/components/work-detail-hero'
import { WorkDetailMetaBar } from '@/components/work-detail-meta-bar'
import { defaultBodyForWork } from '@/lib/work-detail-resolve'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import { cn } from '@/lib/utils'

const workDetailHeroMatchedSizes =
  '(max-width: 1024px) calc(100vw - 4rem), (max-width: 1536px) calc(100vw - 7rem), min(90vw, 1600px)'

function WorkDetailDescriptionBelowImages({
  images,
}: {
  images: ReadonlyArray<{ src: string; alt: string }>
}) {
  if (!images.length) return null
  return (
    <div
      className={cn(
        'mx-auto w-full',
        containerMaxWidthClass,
        containerPaddingClass,
        'mt-10 space-y-6 sm:mt-12 sm:space-y-8 md:space-y-10 lg:mt-14 lg:space-y-12',
      )}
    >
      {images.map((img, i) => (
        <div key={`${img.src}-${i}`} className={workDetailMainImageHeightClass}>
          <WorkDetailFillImage
            src={img.src}
            alt={img.alt}
            sizes={workDetailHeroMatchedSizes}
          />
        </div>
      ))}
    </div>
  )
}

function WorkDetailSecondaryImageDescription({
  paragraphs,
}: {
  paragraphs: ReadonlyArray<string>
}) {
  const visible = paragraphs.map((p) => p.trim()).filter(Boolean)
  if (!visible.length) return null

  return (
    <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:mt-8 md:mt-10 md:grid-cols-2 lg:gap-x-10 xl:gap-x-12">
      {visible.map((paragraph, index) => (
        <p
          key={`${paragraph.slice(0, 20)}-${index}`}
          className="text-justify text-[13px] font-light leading-snug text-foreground/60 sm:text-sm"
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}

export function WorkDetailContent({ detail }: { detail: ResolvedWorkDetail }) {
  const {
    work,
    pageTitle,
    pageTitleLines,
    year,
    location,
    tags,
    projectType,
    roles,
    body,
    additionalImages,
    secondaryHeroImage,
    descriptionNote,
    descriptionBelowImages,
    secondaryImageDescriptionColumns,
    contentBlocks,
  } = detail

  /** Meta bar “Description”: custom note, else stored `body`, else the same default blurb as before. */
  const overview =
    descriptionNote?.trim() || body?.trim() || defaultBodyForWork(work)
  const useFlexibleBody = Boolean(contentBlocks?.length)
  const secondaryImageTopSpacingClass = descriptionBelowImages?.length
    ? 'mt-12 sm:mt-14 md:mt-16 lg:mt-20'
    : 'mt-1 sm:mt-2 md:mt-3 lg:mt-4'
  const secondarySectionPaddingTopClass = descriptionBelowImages?.length
    ? 'pt-6 sm:pt-8 md:pt-10 lg:pt-12'
    : 'pt-0'

  return (
    <article
      className={cn(
        'pb-16 sm:pb-20 md:pb-24 lg:pb-28',
        'pt-6 sm:pt-8 md:pt-9 lg:pt-10',
      )}
    >
      <WorkDetailHero
        work={work}
        pageTitle={pageTitle}
        pageTitleLines={pageTitleLines}
        year={year}
        location={location}
        tags={tags}
      />

      <div
        className={cn(
          'mx-auto w-full',
          containerMaxWidthClass,
          containerPaddingClass,
          'mt-0',
        )}
      >
        <WorkDetailMetaBar
          location={location}
          projectType={projectType}
          year={year}
          roles={roles}
          description={overview}
        />
      </div>

      {useFlexibleBody ? (
        <Container className="pt-0">
          <WorkDetailContentBlocks blocks={contentBlocks ?? []} />
        </Container>
      ) : (
        <>
          {descriptionBelowImages?.length ? (
            <WorkDetailDescriptionBelowImages images={descriptionBelowImages} />
          ) : null}

          <Container className={secondarySectionPaddingTopClass}>
            {secondaryHeroImage ? (
              <>
                <div className={cn(secondaryImageTopSpacingClass, workDetailMainImageHeightClass)}>
                  <WorkDetailFillImage
                    src={secondaryHeroImage.src}
                    alt={secondaryHeroImage.alt}
                    sizes="(max-width: 1024px) calc(100vw - 4rem), (max-width: 1536px) calc(100vw - 7rem), min(90vw, 1600px)"
                  />
                </div>
                <WorkDetailSecondaryImageDescription
                  paragraphs={secondaryImageDescriptionColumns ?? []}
                />
              </>
            ) : null}

            {additionalImages && additionalImages.length > 0 && (
              <div className="mt-12 space-y-8 sm:mt-16 lg:mt-20">
                {additionalImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-4xl"
                  >
                    <WorkDetailFillImage
                      src={img.src}
                      alt={img.alt}
                      className="object-cover"
                      sizes="(max-width: 1023px) 100vw, 90vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </Container>
        </>
      )}
    </article>
  )
}
