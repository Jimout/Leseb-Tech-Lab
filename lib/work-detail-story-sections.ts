import {
  deriveBlocksFromLegacy,
  normalizeWorkDetailContentBlocks,
  type WorkDetailContentBlock,
} from '@/lib/work-detail-content-blocks'
import type { ResolvedWorkDetail } from '@/lib/work-detail-types'

export function resolveWorkDetailStorySections(
  detail: ResolvedWorkDetail,
): WorkDetailContentBlock[] {
  if (detail.contentBlocks?.length) {
    return normalizeWorkDetailContentBlocks(detail.contentBlocks)
  }
  return deriveBlocksFromLegacy(detail)
}
