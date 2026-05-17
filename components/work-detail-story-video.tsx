'use client'

import { WorkDetailStoryGallery } from '@/components/work-detail-story-gallery'
import { WorkDetailStorySplitCopy } from '@/components/work-detail-story-split-copy'
import { resolveWorkDetailStoryGallery } from '@/lib/work-detail-story-gallery'
import { MediaRenderer } from '@/components/media-renderer'
import { resolveWorkDetailStoryVideo } from '@/lib/work-detail-story-video'
import {
  workDetailHeroMediaFrameClass,
  workDetailHeroMediaSizes,
  workDetailStoryVideoSectionClass,
} from '@/lib/work-detail-typography'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import { cn } from '@/lib/utils'

type WorkDetailStoryVideoProps = {
  detail: ResolvedWorkDetail
}

export function WorkDetailStoryVideo({ detail }: WorkDetailStoryVideoProps) {
  const media = resolveWorkDetailStoryVideo(detail)
  const title = detail.storyVideoTitle
  const description = detail.storyVideoDescription
  const hasGallery = resolveWorkDetailStoryGallery(detail).length > 0
  const hasGalleryCopy = Boolean(
    detail.storyGalleryTitle?.trim() || detail.storyGalleryDescription?.trim(),
  )

  if (!media && !title?.trim() && !description?.trim() && !hasGallery && !hasGalleryCopy) {
    return null
  }

  return (
    <div className={workDetailStoryVideoSectionClass}>
      {media ? (
        <div className={workDetailHeroMediaFrameClass}>
          <MediaRenderer
            media={media}
            className="size-full object-cover"
            sizes={workDetailHeroMediaSizes}
            controls={false}
            autoplay
          />
        </div>
      ) : null}

      <WorkDetailStorySplitCopy
        title={title}
        description={description}
        className={cn(!media && 'mt-0')}
      />

      <WorkDetailStoryGallery detail={detail} />
    </div>
  )
}
