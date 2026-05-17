import type { MediaAsset } from '@/lib/media-assets'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'
import type { ShowcaseWork } from '@/lib/works-showcase-data'

export const DEFAULT_WORK_STORY_VIDEO: MediaAsset = {
  type: 'video',
  url: '/0001-0120.mp4',
  alt: 'Project walkthrough',
}

export function defaultStoryVideoForWork(work: ShowcaseWork): MediaAsset {
  const fromCard = work.mediaAssets.find((a) => a.type === 'video' && a.url?.trim())
  if (fromCard) return fromCard
  return {
    ...DEFAULT_WORK_STORY_VIDEO,
    alt: `${work.title} project video`,
  }
}

export function resolveWorkDetailStoryVideo(detail: ResolvedWorkDetail): MediaAsset | null {
  if (detail.storyVideo === null) return null
  const media = detail.storyVideo
  if (media?.url?.trim()) return media
  return null
}
