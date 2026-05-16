import { InsightArticleWithSidebar } from '@/components/insight-article-with-sidebar'
import { InsightDetailArticleLayout } from '@/components/insight-detail-article-layout'
import { InsightDetailHero } from '@/components/insight-detail-hero'
import { InsightDetailRelated } from '@/components/insight-detail-related'
import type { InsightDetail } from '@/lib/insight-detail-types'
import { insightHasExtendedBody, resolveInsightBody } from '@/lib/insight-detail-body'
import {
  landingPageContentMaxClass,
  landingPageGutterClass,
} from '@/lib/landing-page-layout'
import { insightDetailProseClass } from '@/lib/insight-detail-typography'
import { cn } from '@/lib/utils'

function InsightBodyHtml({ html }: { html: string }) {
  if (!html.trim()) return null
  return (
    <div
      className={cn('insight-simple-prose', insightDetailProseClass)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function InsightDetailContent({ detail }: { detail: InsightDetail }) {
  const body = resolveInsightBody(detail)
  const showHeroDek = insightHasExtendedBody(detail) && Boolean(detail.description?.trim())

  return (
    <article className="bg-background text-foreground">
      <InsightDetailHero
        title={detail.title}
        date={detail.date}
        dateIso={detail.dateIso}
        description={showHeroDek ? detail.description : ''}
        heroMedia={detail.heroMedia}
        filterIds={detail.filterIds}
      />

      {body ? (
        <section
          className={cn('pb-4 sm:pb-6 md:pb-8', landingPageGutterClass)}
          aria-label="Article"
        >
          <div className={cn('mx-auto min-w-0', landingPageContentMaxClass)}>
            {body.kind === 'structured' ? (
              <InsightArticleWithSidebar article={body.article} />
            ) : (
              <InsightDetailArticleLayout tocItems={body.toc}>
                <InsightBodyHtml html={body.html} />
              </InsightDetailArticleLayout>
            )}
          </div>
        </section>
      ) : null}

      <InsightDetailRelated excludeId={detail.id} />
    </article>
  )
}
