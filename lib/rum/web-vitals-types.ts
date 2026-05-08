/**
 * Dashboard / warehouse–friendly row for Core Web Vitals RUM.
 * No PII: no full User-Agent, cookies, or IP in the stored payload.
 */
export type WebVitalsDeviceSnapshot = {
  deviceClass: 'mobile' | 'tablet' | 'desktop'
  coarsePointer: boolean
  viewportWidth: number
  viewportHeight: number
  dpr: number
  /** Network Information API when available (not PII). */
  effectiveConnectionType?: 'slow-2g' | '2g' | '3g' | '4g'
}

export type WebVitalsIngestRow = {
  schemaVersion: 1
  /** ISO 8601 — set server-side when persisting. */
  receivedAt: string
  /** Client-reported path (pathname + optional search if you extend later). */
  path: string
  metricName: 'LCP' | 'CLS' | 'INP' | 'FCP' | 'TTFB'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  metricId: string
  navigationType?: string
  /** CLS (and similar) session delta when applicable. */
  delta?: number
  device?: WebVitalsDeviceSnapshot
  /** Client clock for skew debugging; optional. */
  clientTs?: string
}
