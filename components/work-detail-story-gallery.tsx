import { WorkDetailFillImage } from '@/components/work-detail-fill-image'
import { WorkDetailStorySplitCopy } from '@/components/work-detail-story-split-copy'
import {
  resolveWorkDetailStoryGallery,
  storyGalleryCellLayoutClass,
} from '@/lib/work-detail-story-gallery'
import { workDetailStoryGalleryGridClass } from '@/lib/work-detail-typography'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import { cn } from '@/lib/utils'

const topImageSizes = '(max-width: 768px) 100vw, 50vw'
const bottomImageSizes = '(max-width: 1024px) 100vw, (max-width: 1536px) calc(100vw - 7rem), min(90vw, 1600px)'

type WorkDetailStoryGalleryProps = {
  detail: ResolvedWorkDetail
  className?: string
}

export function WorkDetailStoryGallery({ detail, className }: WorkDetailStoryGalleryProps) {
  const images = resolveWorkDetailStoryGallery(detail)
  const title = detail.storyGalleryTitle
  const description = detail.storyGalleryDescription
  const hasCopy = Boolean(title?.trim() || description?.trim())

  if (images.length === 0 && !hasCopy) return null

  return (
    <div className={className}>
      {images.length > 0 ? (
        <div className={workDetailStoryGalleryGridClass} aria-label="Project gallery">
          {images.map((image, index) => {
            const isBottom = index === 2
            return (
              <div
                key={`${image.src}-${index}`}
                className={cn(
                  'relative w-full overflow-hidden rounded-2xl bg-image-well sm:rounded-3xl',
                  isBottom ? 'aspect-[16/9]' : 'aspect-[4/3]',
                  storyGalleryCellLayoutClass(index),
                )}
              >
                <WorkDetailFillImage
                  src={image.src}
                  alt={image.alt}
                  sizes={isBottom ? bottomImageSizes : topImageSizes}
                />
              </div>
            )
          })}
        </div>
      ) : null}

      <WorkDetailStorySplitCopy
        title={title}
        description={description}
        className={images.length === 0 ? 'mt-0' : undefined}
      />
    </div>
  )
}
