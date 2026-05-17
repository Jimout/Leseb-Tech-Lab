import type { WorkDetailPatch, WorkRow } from '@/lib/work-admin-types'

export type { WorkRow } from '@/lib/work-admin-types'
export { WORK_STORAGE_KEY } from '@/lib/admin/work-storage-key'

export function emptyWorkDetail(): WorkDetailPatch {
  return {
    descriptionNote: '',
    websiteUrl: '',
    client: '',
    industry: '',
    duration: '',
    storyGalleryImages: [],
  }
}

export function emptyWork(): WorkRow {
  return {
    id: '',
    publicId: '',
    slug: '',
    heroMedia: null,
    mediaAssets: [],
    year: '',
    location: '',
    title: '',
    category: '',
    cardSummary: '',
    filterIds: [],
    detail: emptyWorkDetail(),
  }
}
