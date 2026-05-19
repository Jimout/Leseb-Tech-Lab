'use client'

import * as React from 'react'

import { InsightDetailNewsletterRail } from '@/components/insight-detail-newsletter-rail'
import { InsightDetailShare } from '@/components/insight-detail-share'
import {
  InsightDetailTocDesktop,
  InsightDetailTocMobile,
  useInsightTocActiveSection,
} from '@/components/insight-detail-toc'
import type { InsightTocItem } from '@/lib/insight-types'
import {
  insightDetailArticleRailPadClass,
  insightDetailBlogMeasureClass,
  insightDetailSidebarStickyClass,
} from '@/lib/insight-detail-typography'
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
        insightDetailArticleRailPadClass,
        'flex flex-col gap-10 sm:gap-12',
        'lg:grid lg:grid-cols-12 lg:gap-x-6 xl:gap-x-8',
        '2xl:gap-x-6 3xl:gap-x-8 4xl:gap-x-10',
      )}
    >
      <aside
        className={cn(
          'order-2 min-w-0 lg:order-1',
          showToc ? 'lg:col-span-5 xl:col-span-4 2xl:col-span-3' : 'lg:col-span-4 xl:col-span-3 2xl:hidden',
        )}
      >
        <div className={cn(insightDetailSidebarStickyClass, 'flex flex-col gap-8')}>
          {showToc ? <InsightDetailTocDesktop items={tocItems} activeId={activeId} /> : null}
          <InsightDetailShare className="hidden lg:block 2xl:hidden" />
        </div>
      </aside>

      <div
        className={cn(
          'order-1 min-w-0 lg:order-2',
          showToc ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-8 xl:col-span-9',
          showToc ? '2xl:col-span-6' : '2xl:col-span-9',
        )}
      >
        {showToc ? <InsightDetailTocMobile items={tocItems} activeId={activeId} /> : null}
        <InsightDetailShare className="mb-8 px-4 sm:mb-10 sm:px-5 lg:hidden" />
        <div className={insightDetailBlogMeasureClass}>{children}</div>
      </div>

      <aside className="order-3 hidden min-w-0 2xl:col-span-3 2xl:block">
        <div className={cn(insightDetailSidebarStickyClass, 'flex flex-col gap-8')}>
          <InsightDetailShare />
          <InsightDetailNewsletterRail />
        </div>
      </aside>
    </div>
  )
}
