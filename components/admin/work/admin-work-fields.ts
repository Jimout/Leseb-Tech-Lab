import type { WorkDetailPatch, WorkRow } from '@/lib/work-admin-types'

export type { WorkRow } from '@/lib/work-admin-types'
export { WORK_STORAGE_KEY } from '@/lib/admin/work-storage-key'

export function emptyWorkDetail(): WorkDetailPatch {
  return {
    pageTitle: '',
    pageTitleLine1: '',
    pageTitleLine2: '',
    year: '',
    projectType: '',
    body: '',
    descriptionNote: '',
    secondaryImageDescriptionColumns: ['', '', '', ''],
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
    filterIds: [],
    detail: emptyWorkDetail(),
  }
}
