'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { IconType } from 'react-icons/lib'
import { FaLinkedinIn } from 'react-icons/fa6'
import {
  SiInstagram,
  SiTelegram,
  SiTiktok,
  SiYoutube,
} from 'react-icons/si'

import { containerPaddingClass } from '@/components/layout/container'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { footerSocialLabel } from '@/lib/admin/site-settings'
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
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
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
  const configured = defaults.socialLinks ?? []
  const resolvedSocial =
    configured.length > 0
      ? configured.map((x) => ({ href: x.href, label: footerSocialLabel(x.iconId), Icon: iconFor(x.iconId) }))
      : socialLinks
  const footerEmail = (email ?? defaults.email).trim()
  const footerPrivacyHref = privacyHref ?? defaults.privacyHref

  return (
    <footer
      id="contact"
      className={cn(
        'scroll-mt-24 w-full text-foreground',
        containerPaddingClass,
        'pt-10 pb-10 sm:pt-12 sm:pb-12 md:pt-14 md:pb-14 lg:pt-16 lg:pb-16 xl:pt-20 xl:pb-20 2xl:pt-20 2xl:pb-20 3xl:pt-24 3xl:pb-24 4xl:pt-28 4xl:pb-28',
        className,
      )}
    >
      <section className="mx-auto w-full max-w-[1400px] overflow-hidden rounded-4xl border border-border">
        {/* Top action panels */}
        <div className="grid grid-cols-1 bg-white md:grid-cols-2">
          <Link
            href="/contact"
            className={cn(
              'relative block overflow-hidden border-b border-border p-8 sm:p-10 md:border-b-0 md:border-r lg:p-12 xl:p-14 2xl:p-16 3xl:p-18 4xl:p-20',
              'text-black',
            )}
          >
            <div className="flex items-start justify-between gap-6">
              <h3 className="font-display text-4xl font-semibold leading-[0.9] tracking-[-0.04em] text-current md:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl">
                LET&apos;S WORK
                <br />
                TOGETHER
              </h3>
              <span className="grid size-10 place-items-center rounded-md border border-border bg-black/5 sm:size-11 md:size-12 2xl:size-14 3xl:size-16 4xl:size-18">
                <ArrowUpRight className="size-5 text-current sm:size-6 md:size-6 2xl:size-7 3xl:size-8 4xl:size-9" aria-hidden />
              </span>
            </div>
            <p className="mt-12 max-w-md text-sm leading-relaxed text-black/70 sm:mt-14 md:mt-16 lg:mt-18 xl:mt-20 2xl:mt-24 2xl:text-base 3xl:text-lg 4xl:text-xl">
              Have an idea worth making real?{' '}
              <a className="font-medium text-black hover:underline" href={`mailto:${footerEmail}`}>
                {footerEmail}
              </a>
            </p>
            <span className="pointer-events-none absolute inset-y-0 right-0 hidden w-px bg-border md:block" aria-hidden />
          </Link>

          <Link
            href="/about"
            className={cn(
              'relative block overflow-hidden p-8 sm:p-10 lg:p-12 xl:p-14 2xl:p-16 3xl:p-18 4xl:p-20',
              'text-black',
            )}
          >
            <div className="flex items-start justify-between gap-6">
              <h3 className="font-display text-4xl font-semibold leading-[0.9] tracking-[-0.04em] text-current md:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl">
                ABOUT
                <br />
                US
              </h3>
              <span className="grid size-10 place-items-center rounded-md border border-border bg-black/5 sm:size-11 md:size-12 2xl:size-14 3xl:size-16 4xl:size-18">
                <ArrowUpRight className="size-5 text-current sm:size-6 md:size-6 2xl:size-7 3xl:size-8 4xl:size-9" aria-hidden />
              </span>
            </div>
            <p className="mt-12 max-w-md text-sm leading-relaxed text-black/70 sm:mt-14 md:mt-16 lg:mt-18 xl:mt-20 2xl:mt-24 2xl:text-base 3xl:text-lg 4xl:text-xl">
              Learn more about our journey and what we’re building.
            </p>
          </Link>
        </div>

        {/* Black footer */}
        <div className="border-t border-border bg-black text-white">
          <div className="grid gap-10 px-8 py-10 sm:px-10 sm:py-12 md:grid-cols-12 md:gap-8 md:px-14 md:py-14 lg:px-16 lg:py-16 xl:px-18 xl:py-18 2xl:px-20 2xl:py-20 3xl:px-24 3xl:py-24 4xl:px-28 4xl:py-28">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <span className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-4xl xl:text-5xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl">leseb</span>
            </div>
            <p className="mt-4 text-sm text-white/70">
              Have questions or want to chat?
              <br />
              Drop us a line →{' '}
              <a className="text-signal hover:underline" href={`mailto:${footerEmail}`}>
                {footerEmail}
              </a>
            </p>
          </div>

          <div className="md:col-span-8">
            <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
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
              className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.2em] hover:text-white"
            >
              <span className="grid size-7 place-items-center rounded-full bg-white/8">↑</span>
              Back to top
            </a>
          </div>
        </div>
      </section>
    </footer>
  )
}
