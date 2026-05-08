import { InsightArticleWithSidebar } from '@/components/insight-article-with-sidebar'
import { Container } from '@/components/layout/container'
import { InsightDetailHero } from '@/components/insight-detail-hero'
import { InsightsShowcase } from '@/components/insights-showcase'
import type { InsightDetail } from '@/lib/insight-detail-types'
import { isInsightHtmlEmpty, sanitizeInsightHtml } from '@/lib/sanitize-insight-html'
import { cn } from '@/lib/utils'

function InsightArticleBody({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <div
      className={cn(
        'mt-12 max-w-3xl space-y-6 sm:mt-14 sm:space-y-7 md:mt-16 lg:mt-20',
        'lg:space-y-8',
      )}
    >
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className="text-justify text-[15px] font-normal leading-relaxed text-foreground/95 sm:text-base lg:text-[17px] lg:leading-[1.75]"
        >
          {p}
        </p>
      ))}
    </div>
  )
}

function InsightSimpleBodyHtml({ html }: { html: string }) {
  const safe = sanitizeInsightHtml(html)
  if (!safe.trim()) return null
  return (
    <div
      className={cn(
        'insight-simple-prose mt-12 max-w-3xl sm:mt-14 md:mt-16 lg:mt-20',
        'space-y-6 text-justify text-[15px] font-normal leading-relaxed text-foreground/95 sm:text-base lg:text-[17px] lg:leading-[1.75]',
        '[&_a]:text-accent [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:text-justify [&_ul]:list-disc [&_ul]:pl-6',
      )}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  )
}

export function InsightDetailContent({ detail }: { detail: InsightDetail }) {
  const article = detail.article
  const simple = detail.simpleBodyHtml

  return (
    <article
      className={cn(
        'pb-16 sm:pb-20 md:pb-24 lg:pb-28',
        'pt-6 sm:pt-8 md:pt-9 lg:pt-10',
      )}
    >
      <InsightDetailHero
        title={detail.title}
        date={detail.date}
        dateIso={detail.dateIso}
        heroMedia={detail.heroMedia}
      />
      <Container className="pt-6 sm:pt-8 md:pt-10 lg:pt-12">
        {article ? (
          <InsightArticleWithSidebar article={article} />
        ) : simple ? (
          <InsightSimpleBodyHtml html={simple} />
        ) : (
          <InsightArticleBody paragraphs={detail.paragraphs} />
        )}
        <section
          className="mt-16 sm:mt-20 md:mt-24 lg:mt-28"
          aria-labelledby="insight-related-heading"
        >
          <InsightsShowcase variant="related" excludeIds={[detail.id]} />
        </section>
      </Container>
    </article>
  )
}
