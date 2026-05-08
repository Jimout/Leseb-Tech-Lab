import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbJsonLd, type BreadcrumbItem } from '@/lib/seo/schema'

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null
  return <JsonLd data={breadcrumbJsonLd(items)} />
}
