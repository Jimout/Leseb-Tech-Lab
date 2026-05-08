export const notificationTypeValues = [
  'WORK_PUBLISHED',
  'INSIGHT_PUBLISHED',
  'IMPORTANT_UPDATE',
] as const

export type NotificationTypeValue = (typeof notificationTypeValues)[number]

/** Max delivery attempts per subscriber before giving up (matches dispatch logic). */
export const NOTIFICATION_MAX_RETRY = 5

/** Hard cap on error text stored on NotificationDelivery.error (last error message). */
export const DELIVERY_ERROR_MAX_LEN = 2000

/** Defaults overridable via env in dispatch route / service. */
export const DISPATCH_DEFAULT_MAX_MS = 120_000
export const DISPATCH_DEFAULT_MAX_SENDS_PER_RUN = 100
export const DISPATCH_DEFAULT_MAX_EVENTS_PER_RUN = 20
/** Lease duration for cross-instance dispatch lock (stale locks recover after this). */
export const DISPATCH_LOCK_LEASE_MS = 15 * 60_000
