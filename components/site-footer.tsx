'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import type { IconType } from 'react-icons/lib'
import { FaLinkedinIn } from 'react-icons/fa6'
import {
  SiInstagram,
  SiTelegram,
  SiTiktok,
  SiYoutube,
} from 'react-icons/si'

import { FooterNewsletterSubscribe } from '@/components/footer-newsletter-subscribe'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { footerSocialLabel } from '@/lib/admin/site-settings'
import { toTelHref } from '@/lib/phone-tel'
import { cn } from '@/lib/utils'

export type FooterSocialItem = {
  href: string
  label: string
  Icon: IconType
}

const DEFAULT_SOCIAL: FooterSocialItem[] = [
  { href: 'https://instagram.com', label: 'Instagram', Icon: SiInstagram },
  { href: 'https://tiktok.com', label: 'TikTok', Icon: SiTiktok },
  { href: 'https://youtube.com', label: 'YouTube', Icon: SiYoutube },
  { href: 'https://linkedin.com', label: 'LinkedIn', Icon: FaLinkedinIn },
  { href: 'https://t.me', label: 'Telegram', Icon: SiTelegram },
]

function iconFor(id: string): IconType {
  switch (id) {
    case 'instagram':
      return SiInstagram
    case 'tiktok':
      return SiTiktok
    case 'youtube':
      return SiYoutube
    case 'linkedin':
      return FaLinkedinIn
    case 'telegram':
      return SiTelegram
    default:
      return SiInstagram
  }
}

function scrollToHomeSmooth(e: React.MouseEvent<HTMLAnchorElement>) {
  if (e.button !== 0) return
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const home = document.getElementById('home')
  if (home) {
    home.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  } else {
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
  }
}

/** Match Services grid (lab-section): fill slide + text timings. */
const footerPanelMotionDuration = 'duration-500'
const footerPanelMotionEase = 'ease-[cubic-bezier(0.65,0,0.35,1)]'

function FooterPanelArrowChip() {
  return (
    <span
      className={cn(
        'relative grid size-10 place-items-center overflow-hidden rounded-full',
        'border border-foreground/12 bg-background shadow-sm',
        'transition-[border-color,background-color,box-shadow,color] sm:size-11 md:size-12 2xl:size-14 3xl:size-16 4xl:size-18',
        'group-hover:border-foreground/20 group-hover:bg-background group-hover:shadow-md',
        footerPanelMotionDuration,
        footerPanelMotionEase,
      )}
      aria-hidden
    >
      <ArrowUpRight
        strokeWidth={2}
        className={cn(
          /* Match Services grid icons (lab-section): signal → foreground, slight scale + tilt */
          'size-5 origin-center text-signal transition-all duration-500 sm:size-6 md:size-6 2xl:size-7 3xl:size-8 4xl:size-9',
          'group-hover:scale-110 group-hover:-rotate-12 group-hover:text-foreground',
          'motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:text-signal',
        )}
      />
    </span>
  )
}

function SocialIconLink({
  href,
  label,
  Icon,
}: {
  href: string
  label: string
  Icon: IconType
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-full sm:size-9',
        'bg-white/8 text-white transition-colors hover:bg-white/12',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
      aria-label={label}
    >
      <Icon className="size-[0.95rem] sm:size-[1.05rem]" aria-hidden />
    </Link>
  )
}

export type SiteFooterProps = {
  className?: string
  email?: string
  copyrightYear?: number
  privacyHref?: string
  socialLinks?: FooterSocialItem[]
}

export function SiteFooter({
  className,
  email,
  copyrightYear = new Date().getFullYear(),
  privacyHref,
  socialLinks = DEFAULT_SOCIAL,
}: SiteFooterProps) {
  const { settings } = useSiteSettings()
  const defaults = settings.footer
  const configured = (defaults.socialLinks ?? []).filter((x) => x.visible !== false && x.href.trim())
  const resolvedSocial =
    configured.length > 0
      ? configured.map((x) => ({ href: x.href, label: footerSocialLabel(x.iconId), Icon: iconFor(x.iconId) }))
      : socialLinks
  const footerEmail = (email ?? defaults.email).trim()
  const footerPhone = defaults.phone?.trim() ?? ''
  const footerPhoneHref = footerPhone ? toTelHref(footerPhone) : ''
  const footerPrivacyHref = privacyHref ?? defaults.privacyHref

  return (
    <footer
      id="contact"
      className={cn(
        'scroll-mt-24 w-full min-w-0 bg-background px-0 pb-0 text-foreground',
        'pt-10 sm:pt-12 md:pt-14 lg:pt-16 xl:pt-20 2xl:pt-20 3xl:pt-24 4xl:pt-28',
        className,
      )}
    >
      <section className="w-full overflow-hidden rounded-none border border-border">
        {/* Top action panels */}
        <div
          data-nav-surface="dark"
          className="grid grid-cols-1 bg-background md:grid-cols-2"
        >
          <Link
            href="/contact"
            className={cn(
              'group relative isolate block overflow-hidden border-b border-border bg-background p-8 sm:p-10 md:border-b-0 md:border-r lg:p-12 xl:p-14 2xl:p-16 3xl:p-18 4xl:p-20',
              'text-foreground',
              'transition-transform duration-300 group-hover:scale-110 group-hover:z-10',
            )}
          >
            <div
              aria-hidden
              className={cn(
                'pointer-events-none absolute inset-0 -z-10',
              )}
            >
              <div className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-accent scale-0 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100" style={{ transformOrigin: 'center' }} />
              <div className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-accent scale-0 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100" style={{ transformOrigin: 'center' }} />
              <div className="absolute left-0 bottom-0 h-6 w-6 border-l-2 border-b-2 border-accent scale-0 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100" style={{ transformOrigin: 'center' }} />
              <div className="absolute right-0 bottom-0 h-6 w-6 border-r-2 border-b-2 border-accent scale-0 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100" style={{ transformOrigin: 'center' }} />
            </div>
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-6">
                <div
                  className={cn(
                    'min-w-0 flex-1 transition-transform',
                    footerPanelMotionDuration,
                    footerPanelMotionEase,
                    'group-hover:-translate-y-1',
                    'motion-reduce:transition-none motion-reduce:group-hover:translate-y-0',
                  )}
                >
                  <h3
                    className={cn(
                      'font-display text-4xl font-semibold leading-[0.9] tracking-[-0.04em] text-current transition-colors group-hover:text-foreground md:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl',
                      footerPanelMotionDuration,
                      footerPanelMotionEase,
                    )}
                  >
                    {defaults.workPanelLine1}
                    <br />
                    {defaults.workPanelLine2}
                  </h3>
                  <p
                    className={cn(
                      'mt-12 max-w-md text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/85 sm:mt-14 md:mt-16 lg:mt-18 xl:mt-20 2xl:mt-24 2xl:text-base 3xl:text-lg 4xl:text-xl',
                      footerPanelMotionDuration,
                      footerPanelMotionEase,
                    )}
                  >
                    {defaults.workPanelDescription}{' '}
                    <a
                      className={cn(
                        'font-medium text-foreground underline-offset-2 transition-colors group-hover:text-foreground hover:underline',
                        footerPanelMotionDuration,
                        footerPanelMotionEase,
                      )}
                      href={`mailto:${footerEmail}`}
                    >
                      {footerEmail}
                    </a>
                  </p>
                </div>
                <FooterPanelArrowChip />
              </div>
            </div>
            <span
              className={cn(
                'pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-px bg-border transition-colors group-hover:bg-foreground/15 md:block',
                footerPanelMotionDuration,
                footerPanelMotionEase,
              )}
              aria-hidden
            />
          </Link>

          <Link
            href="/about"
            className={cn(
              'group relative isolate block overflow-hidden bg-background p-8 sm:p-10 lg:p-12 xl:p-14 2xl:p-16 3xl:p-18 4xl:p-20',
              'text-foreground',
              'transition-transform duration-300 group-hover:scale-110 group-hover:z-10',
            )}
          >
            <div
              aria-hidden
              className={cn(
                'pointer-events-none absolute inset-0 -z-10',
              )}
            >
              <div className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-accent scale-0 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100" style={{ transformOrigin: 'center' }} />
              <div className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-accent scale-0 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100" style={{ transformOrigin: 'center' }} />
              <div className="absolute left-0 bottom-0 h-6 w-6 border-l-2 border-b-2 border-accent scale-0 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100" style={{ transformOrigin: 'center' }} />
              <div className="absolute right-0 bottom-0 h-6 w-6 border-r-2 border-b-2 border-accent scale-0 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100" style={{ transformOrigin: 'center' }} />
            </div>
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-6">
                <div
                  className={cn(
                    'min-w-0 flex-1 transition-transform',
                    footerPanelMotionDuration,
                    footerPanelMotionEase,
                    'group-hover:-translate-y-1',
                    'motion-reduce:transition-none motion-reduce:group-hover:translate-y-0',
                  )}
                >
                  <h3
                    className={cn(
                      'font-display text-4xl font-semibold leading-[0.9] tracking-[-0.04em] text-current transition-colors group-hover:text-foreground md:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl',
                      footerPanelMotionDuration,
                      footerPanelMotionEase,
                    )}
                  >
                    {defaults.aboutPanelLine1}
                    <br />
                    {defaults.aboutPanelLine2}
                  </h3>
                  <p
                    className={cn(
                      'mt-12 max-w-md text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/85 sm:mt-14 md:mt-16 lg:mt-18 xl:mt-20 2xl:mt-24 2xl:text-base 3xl:text-lg 4xl:text-xl',
                      footerPanelMotionDuration,
                      footerPanelMotionEase,
                    )}
                  >
                    {defaults.aboutPanelDescription}
                  </p>
                </div>
                <FooterPanelArrowChip />
              </div>
            </div>
          </Link>
        </div>

        {/* Black footer */}
        <div data-nav-surface="dark" className="border-t border-border bg-background text-white">
          <div className="grid gap-12 px-8 py-12 sm:px-10 sm:py-14 md:grid-cols-12 md:gap-x-16 md:gap-y-14 md:px-14 md:py-16 lg:gap-x-20 lg:gap-y-16 lg:px-16 lg:py-18 xl:gap-x-24 xl:px-18 xl:py-20 2xl:gap-x-28 2xl:px-20 2xl:py-20 3xl:gap-x-32 3xl:px-24 3xl:py-24 4xl:gap-x-36 4xl:px-28 4xl:py-28">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <span className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-4xl xl:text-5xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl">leseb</span>
            </div>
            <p className="mt-4 space-y-1 text-sm text-white/70">
              <span className="block">{defaults.contactIntro}</span>
              <span className="block">
                Drop us a line →{' '}
                <a className="text-signal hover:underline" href={`mailto:${footerEmail}`}>
                  {footerEmail}
                </a>
              </span>
              {footerPhone && footerPhoneHref ? (
                <span className="block">
                  Or call{' '}
                  <a className="text-signal hover:underline" href={`tel:${footerPhoneHref}`}>
                    {footerPhone}
                  </a>
                </span>
              ) : null}
            </p>
            <FooterNewsletterSubscribe className="mt-6 max-w-md" />
          </div>

          <div className="md:col-span-8">
            <div className="grid grid-cols-2 gap-12 sm:gap-14 md:grid-cols-3 md:gap-16 lg:gap-20 xl:gap-24">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">Platform</p>
                <ul className="mt-4 space-y-2 text-sm text-white/75">
                  <li><Link className="hover:text-white" href="/">Home</Link></li>
                  <li><Link className="hover:text-white" href="/work">Work</Link></li>
                  <li><Link className="hover:text-white" href="/insights">Insights</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">Company</p>
                <ul className="mt-4 space-y-2 text-sm text-white/75">
                  <li><Link className="hover:text-white" href="/about">About</Link></li>
                  <li><Link className="hover:text-white" href="/contact">Contact</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">Legal</p>
                <ul className="mt-4 space-y-2 text-sm text-white/75">
                  <li><Link className="hover:text-white" href={footerPrivacyHref}>Privacy</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">Elsewhere</p>
              <div className="mt-4 flex flex-row flex-wrap items-start gap-2 md:flex-nowrap">
                {resolvedSocial.map((item) => (
                  <SocialIconLink key={item.label} {...item} />
                ))}
              </div>
            </div>
          </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 px-8 py-6 text-xs text-white/55 sm:px-10 md:flex-row md:items-center md:justify-between md:px-14 lg:px-16 xl:px-18 2xl:px-20 3xl:px-24 4xl:px-28">
            <p className="font-mono uppercase tracking-[0.2em]">
              Leseb © {copyrightYear} | All rights reserved
            </p>
            <a
              href="#home"
              onClick={scrollToHomeSmooth}
              className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.2em] text-signal hover:text-signal/90"
            >
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-signal text-secondary-foreground">
                <ArrowUp className="size-3.5 stroke-2" aria-hidden />
              </span>
              Back to top
            </a>
          </div>
        </div>
      </section>
    </footer>
  )
}
