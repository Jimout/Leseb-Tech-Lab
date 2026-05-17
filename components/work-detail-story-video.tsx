'use client'

import { WorkDetailStorySections } from '@/components/work-detail-story-sections'
import { MediaRenderer } from '@/components/media-renderer'
import { resolveWorkDetailStorySections } from '@/lib/work-detail-story-sections'
import { resolveWorkDetailStoryVideo } from '@/lib/work-detail-story-video'
import {
  workDetailHeroMediaFrameClass,
  workDetailHeroMediaSizes,
  workDetailStoryVideoSectionClass,
} from '@/lib/work-detail-typography'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'

type WorkDetailStoryVideoProps = {
  detail: ResolvedWorkDetail
}

export function WorkDetailStoryVideo({ detail }: WorkDetailStoryVideoProps) {
  const media = resolveWorkDetailStoryVideo(detail)
  const sections = resolveWorkDetailStorySections(detail)

  if (!media && sections.length === 0) return null

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

      {sections.length > 0 ? <WorkDetailStorySections blocks={sections} /> : null}
    </div>
  )
}
