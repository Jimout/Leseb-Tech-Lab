'use client'

import * as React from 'react'

import { InsightDetailArticleRich } from '@/components/insight-detail-article-rich'
import { InsightDetailShare } from '@/components/insight-detail-share'
import {
  InsightDetailTocDesktop,
  InsightDetailTocMobile,
  useInsightTocActiveSection,
} from '@/components/insight-detail-toc'
import type { InsightDetail } from '@/lib/insight-detail-types'
import { deriveInsightToc } from '@/lib/insight-types'
import { cn } from '@/lib/utils'

export function InsightArticleWithSidebar({
  article,
}: {
  article: NonNullable<InsightDetail['article']>
}) {
  const tocItems = React.useMemo(() => deriveInsightToc(article), [article])
  const ids = React.useMemo(() => tocItems.map((i) => i.id), [tocItems])
  const activeId = useInsightTocActiveSection(ids)

  return (
    <div
      className={cn(
        'flex flex-col items-stretch gap-10 sm:gap-11',
        'lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0 xl:gap-x-10 2xl:gap-x-12',
      )}
    >
      <div
        className={cn(
          'order-1 -mx-8 sm:-mx-10 md:-mx-12 lg:hidden',
          'px-8 sm:px-10 md:px-12',
        )}
      >
        <InsightDetailTocMobile items={tocItems} activeId={activeId} />
      </div>

      <div
        className={cn(
          'order-2 min-w-0 lg:order-0',
          'lg:col-span-7 lg:col-start-6 lg:row-start-1',
          'xl:col-span-8 xl:col-start-5',
        )}
      >
        <InsightDetailArticleRich sections={article.sections} />
      </div>

      <aside
        className={cn(
          'order-3 min-w-0 lg:order-0',
          'lg:col-span-5 lg:col-start-1 lg:row-start-1',
          'xl:col-span-4 xl:col-start-1',
        )}
      >
        <div className="flex flex-col gap-8 sm:gap-9 lg:sticky lg:top-28 xl:top-32">
          <InsightDetailTocDesktop items={tocItems} activeId={activeId} />
          <InsightDetailShare />
        </div>
      </aside>
    </div>
  )
}
