'use client'

import * as React from 'react'

import { InsightDetailArticleLayout } from '@/components/insight-detail-article-layout'
import { InsightDetailArticleRich } from '@/components/insight-detail-article-rich'
import type { InsightDetail } from '@/lib/insight-detail-types'
import { deriveInsightToc } from '@/lib/insight-types'

export function InsightArticleWithSidebar({
  article,
}: {
  article: NonNullable<InsightDetail['article']>
}) {
  const tocItems = React.useMemo(() => deriveInsightToc(article), [article])

  return (
    <InsightDetailArticleLayout tocItems={tocItems}>
      <InsightDetailArticleRich sections={article.sections} />
    </InsightDetailArticleLayout>
  )
}
