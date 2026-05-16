import type { InsightSection, InsightSectionBlock } from '@/lib/insight-types'
import {
  insightDetailBodyClass,
  insightDetailSectionStackClass,
  insightDetailSectionTitleClass,
  insightDetailTitleBodyGapClass,
} from '@/lib/insight-detail-typography'
import { sanitizeInsightHtml } from '@/lib/sanitize-insight-html'
import { cn } from '@/lib/utils'

const pClass = cn(insightDetailBodyClass, 'max-w-3xl text-pretty')

const listItemClass = cn(insightDetailBodyClass, 'text-pretty')

function BlockRenderer({ block }: { block: InsightSectionBlock }) {
  if (block.type === 'p') {
    return (
      <p
        className={pClass}
        dangerouslySetInnerHTML={{ __html: sanitizeInsightHtml(block.html) }}
      />
    )
  }
  if (block.type === 'ol') {
    return (
      <ol className="max-w-3xl list-decimal space-y-3 pl-6 marker:text-foreground/60">
        {block.items.map((item) => (
          <li key={item} className={listItemClass}>
            {item}
          </li>
        ))}
      </ol>
    )
  }
  return (
    <ul className="max-w-3xl space-y-3">
      {block.items.map((item) => (
        <li key={item} className={cn('flex gap-3', listItemClass)}>
          <span className="shrink-0 pt-0.5 text-signal" aria-hidden>
            →
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function InsightDetailArticleRich({ sections }: { sections: InsightSection[] }) {
  return (
    <div className={insightDetailSectionStackClass}>
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-28 sm:scroll-mt-32"
        >
          <h2 className={insightDetailSectionTitleClass}>{section.heading}</h2>
          <div className={cn(insightDetailTitleBodyGapClass, 'space-y-4 sm:space-y-5')}>
            {section.blocks.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
