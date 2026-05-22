/** Remove stuck Radix modal overlays and body scroll locks (admin shell / sheets). */
export function releaseRadixOverlays() {
  if (typeof document === 'undefined') return

  document
    .querySelectorAll(
      '[data-slot="sheet-overlay"],[data-slot="dialog-overlay"],[data-slot="alert-dialog-overlay"],[data-slot="drawer-overlay"]',
    )
    .forEach((el) => el.remove())

  document.body.style.pointerEvents = ''
  document.documentElement.style.pointerEvents = ''
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
  document.body.removeAttribute('data-scroll-locked')
  document.documentElement.removeAttribute('data-scroll-locked')
}
