import type { InsightSection, InsightSectionBlock } from '@/lib/insight-types'
import { sanitizeInsightHtml } from '@/lib/sanitize-insight-html'
import { cn } from '@/lib/utils'

const pClass = cn(
  'max-w-[65ch] text-justify text-[15px] font-normal leading-[1.75] text-foreground/90 sm:text-base lg:text-[17px] lg:leading-[1.8]',
  // Ultra-wide layouts: allow the rich article text to expand to the page padding
  // instead of staying stuck at 65ch near the TOC.
  '2xl:max-w-none 3xl:max-w-none 4xl:max-w-none',
)

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
      <ol className="max-w-[65ch] 2xl:max-w-none 3xl:max-w-none 4xl:max-w-none list-decimal space-y-3 pl-6 marker:text-foreground/70">
        {block.items.map((item) => (
          <li
            key={item}
            className="text-[15px] leading-[1.75] text-foreground/90 sm:text-base lg:text-[17px] lg:leading-[1.8]"
          >
            {item}
          </li>
        ))}
      </ol>
    )
  }
  return (
    <ul className="max-w-[65ch] 2xl:max-w-none 3xl:max-w-none 4xl:max-w-none space-y-3">
      {block.items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-[15px] leading-[1.75] text-foreground/90 sm:text-base lg:text-[17px]"
        >
          <span className="shrink-0 pt-0.5 text-foreground" aria-hidden>
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
    <div className="space-y-12 sm:space-y-14 lg:space-y-15">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-28 sm:scroll-mt-32"
        >
          <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-[1.875rem] xl:text-[2rem]">
            {section.heading}
          </h2>
          <div className="mt-5 space-y-5 sm:mt-6 sm:space-y-6 lg:mt-7">
            {section.blocks.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
