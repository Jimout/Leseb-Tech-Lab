import {
  workDetailSplitBodyClass,
  workDetailSplitTitleClass,
  workDetailStoryCopyGridClass,
} from '@/lib/work-detail-typography'
import { cn } from '@/lib/utils'

type WorkDetailStorySplitCopyProps = {
  title?: string
  description?: string
  className?: string
}

export function WorkDetailStorySplitCopy({
  title,
  description,
  className,
}: WorkDetailStorySplitCopyProps) {
  const trimmedTitle = title?.trim() ?? ''
  const trimmedDescription = description?.trim() ?? ''
  if (!trimmedTitle && !trimmedDescription) return null

  return (
    <div className={cn(workDetailStoryCopyGridClass, className)}>
      <div className="min-w-0 md:col-span-5 lg:col-span-5">
        {trimmedTitle ? <h2 className={workDetailSplitTitleClass}>{trimmedTitle}</h2> : null}
      </div>
      <div className="min-w-0 md:col-span-7 lg:col-span-7">
        {trimmedDescription ? (
          <p className={workDetailSplitBodyClass}>{trimmedDescription}</p>
        ) : null}
      </div>
    </div>
  )
}
