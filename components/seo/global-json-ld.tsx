import { JsonLd } from '@/components/seo/json-ld'
import { siteGraphJsonLd } from '@/lib/seo/schema'

/**
 * Site-wide JSON-LD @graph (Person + WebSite + ProfessionalService) on every HTML response.
 */
export function GlobalJsonLd() {
  return <JsonLd data={siteGraphJsonLd()} />
}
