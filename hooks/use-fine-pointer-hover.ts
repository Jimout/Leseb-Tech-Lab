'use client'

import * as React from 'react'

/** True when the device can hover with a fine pointer (typical mouse desktop / laptop trackpad). */
const QUERY = '(pointer: fine) and (hover: hover)'

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

function getServerSnapshot() {
  return false
}

export function useFinePointerHover() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
