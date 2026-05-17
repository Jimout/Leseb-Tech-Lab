import { FluidSplitButton } from '@/components/fluid-split-button'
import { WorkDetailFillImage } from '@/components/work-detail-fill-image'
import { WorkDetailStorySplitCopy } from '@/components/work-detail-story-split-copy'
import {
  galleryGridClass,
  type WorkDetailContentBlock,
} from '@/lib/work-detail-content-blocks'
import { workDetailStoryCopyGridClass } from '@/lib/work-detail-typography'
import { normalizeExternalUrl } from '@/lib/normalize-external-url'
import { cn } from '@/lib/utils'

const galleryImageSizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'

type WorkDetailStorySectionsProps = {
  blocks: ReadonlyArray<WorkDetailContentBlock>
  className?: string
}

export function WorkDetailStorySections({ blocks, className }: WorkDetailStorySectionsProps) {
  if (!blocks.length) return null

  return (
    <div className={cn('space-y-12 sm:space-y-14 md:space-y-16 lg:space-y-20', className)}>
      {blocks.map((block) => {
        if (block.type === 'text') {
          return (
            <WorkDetailStorySplitCopy
              key={block.id}
              title={block.title}
              description={block.description}
              className={workDetailStoryCopyGridClass}
            />
          )
        }

        if (block.type === 'gallery') {
          const images = block.images.filter((img) => img.src?.trim())
          const hasCopy = Boolean(block.title?.trim() || block.description?.trim())
          if (!images.length && !hasCopy) return null

          return (
            <div key={block.id} className="space-y-12 sm:space-y-14 md:space-y-16 lg:space-y-20">
              {images.length > 0 ? (
                <div
                  className={cn(galleryGridClass(block.columns), 'mt-12 sm:mt-14 md:mt-16 lg:mt-20')}
                  aria-label="Project gallery"
                >
                  {images.map((image, index) => (
                    <div
                      key={`${image.src}-${index}`}
                      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-image-well sm:rounded-3xl"
                    >
                      <WorkDetailFillImage
                        src={image.src}
                        alt={image.alt}
                        sizes={galleryImageSizes}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              {hasCopy ? (
                <WorkDetailStorySplitCopy
                  title={block.title}
                  description={block.description}
                  className={workDetailStoryCopyGridClass}
                />
              ) : null}
            </div>
          )
        }

        if (block.type === 'button') {
          const href = normalizeExternalUrl(block.url)
          if (!href) return null
          return (
            <div key={block.id} className="flex justify-center pt-2 sm:pt-4">
              <FluidSplitButton
                label={block.label?.trim() || 'Visit website'}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="default"
              />
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
