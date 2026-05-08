/**
 * Injects JSON-LD into the document (server component).
 * Pass a single object or @graph array for multiple entities.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = Array.isArray(data) ? { '@context': 'https://schema.org', '@graph': data } : data
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD requires a raw script payload
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
