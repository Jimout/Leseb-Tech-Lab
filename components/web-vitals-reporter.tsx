'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import type { WebVitalsDeviceSnapshot } from '@/lib/rum/web-vitals-types'

const REPORTED_METRICS = new Set(['CLS', 'LCP', 'INP', 'FCP', 'TTFB'])

function snapshotDevice(): WebVitalsDeviceSnapshot | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window.innerWidth
  const h = window.innerHeight
  const deviceClass: WebVitalsDeviceSnapshot['deviceClass'] =
    w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'
  let coarsePointer = false
  try {
    coarsePointer = window.matchMedia('(pointer: coarse)').matches
  } catch {
    // ignore
  }
  let effectiveConnectionType: WebVitalsDeviceSnapshot['effectiveConnectionType']
  try {
    const c = navigator.connection as
      | { effectiveType?: WebVitalsDeviceSnapshot['effectiveConnectionType'] }
      | undefined
    if (c?.effectiveType && ['slow-2g', '2g', '3g', '4g'].includes(c.effectiveType)) {
      effectiveConnectionType = c.effectiveType
    }
  } catch {
    // ignore
  }
  return {
    deviceClass,
    coarsePointer,
    viewportWidth: Math.round(w),
    viewportHeight: Math.round(h),
    dpr: typeof window.devicePixelRatio === 'number' ? window.devicePixelRatio : 1,
    effectiveConnectionType,
  }
}

function sendPayload(body: string) {
  const url = '/api/web-vitals'
  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], { type: 'application/json' })
    if (navigator.sendBeacon(url, blob)) return
  }
  void fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // best-effort RUM
  })
}

export function WebVitalsReporter() {
  const pathname = usePathname() || ''
  const pathRef = React.useRef(pathname)
  pathRef.current = pathname

  const onMetric = React.useCallback((metric: {
    name: string
    value: number
    rating: 'good' | 'needs-improvement' | 'poor'
    id: string
    navigationType?: string
    delta?: number
  }) => {
    if (process.env.NEXT_PUBLIC_WEB_VITALS_ENABLED === '0') return
    if (!REPORTED_METRICS.has(metric.name)) return

    const path = pathRef.current
    if (path.startsWith('/admin') || path.startsWith('/leseb-admin')) return

    const payload = {
      schemaVersion: 1 as const,
      path,
      metricName: metric.name as 'LCP' | 'CLS' | 'INP' | 'FCP' | 'TTFB',
      value: metric.value,
      rating: metric.rating,
      metricId: metric.id,
      navigationType: metric.navigationType,
      delta: 'delta' in metric && typeof metric.delta === 'number' ? metric.delta : undefined,
      device: snapshotDevice(),
      clientTs: new Date().toISOString(),
    }

    sendPayload(JSON.stringify(payload))
  }, [])

  useReportWebVitals(onMetric)

  return null
}
