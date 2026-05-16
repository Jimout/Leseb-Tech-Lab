'use client'

import * as React from 'react'

import { InsightDetailShare } from '@/components/insight-detail-share'
import {
  InsightDetailTocDesktop,
  InsightDetailTocMobile,
  useInsightTocActiveSection,
} from '@/components/insight-detail-toc'
import type { InsightTocItem } from '@/lib/insight-types'
import { insightDetailSidebarStickyClass } from '@/lib/insight-detail-typography'
import { cn } from '@/lib/utils'

export function InsightDetailArticleLayout({
  tocItems,
  children,
}: {
  tocItems: readonly InsightTocItem[]
  children: React.ReactNode
}) {
  const ids = React.useMemo(() => tocItems.map((i) => i.id), [tocItems])
  const activeId = useInsightTocActiveSection(ids)
  const showToc = tocItems.length > 0

  return (
    <div
      className={cn(
        'flex flex-col gap-10 sm:gap-12',
        'lg:grid lg:grid-cols-12 lg:gap-x-10 xl:gap-x-12',
      )}
    >
      <div className="order-1 min-w-0 lg:order-2 lg:col-span-7 xl:col-span-8">
        {showToc ? <InsightDetailTocMobile items={tocItems} activeId={activeId} /> : null}
        {children}
      </div>

      <aside className="order-2 min-w-0 lg:order-1 lg:col-span-5 xl:col-span-4">
        <div className={cn(insightDetailSidebarStickyClass, 'flex flex-col gap-8')}>
          {showToc ? <InsightDetailTocDesktop items={tocItems} activeId={activeId} /> : null}
          <InsightDetailShare />
        </div>
      </aside>
    </div>
  )
}
