'use client'

import Link from 'next/link'
import type { IconType } from 'react-icons/lib'
import { FaLinkedinIn } from 'react-icons/fa6'
import { SiInstagram, SiTelegram, SiTiktok, SiYoutube } from 'react-icons/si'

import { useSiteSettings } from '@/hooks/use-site-settings'
import { cn } from '@/lib/utils'

function iconFor(id: string): IconType {
  switch (id) {
    case 'instagram':
      return SiInstagram
    case 'tiktok':
      return SiTiktok
    case 'linkedin':
      return FaLinkedinIn
    case 'telegram':
      return SiTelegram
    case 'youtube':
      return SiYoutube
    default:
      return SiInstagram
  }
}

function SocialLink({ href, label, Icon }: { href: string; label: string; Icon: IconType }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background',
        'text-foreground/80 transition-colors',
        'hover:border-signal/40 hover:text-signal',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'sm:size-11',
      )}
      aria-label={label}
    >
      <Icon className="size-4 sm:size-[1.1rem]" aria-hidden />
    </Link>
  )
}

export function ContactSocialRow({ className }: { className?: string }) {
  const { settings } = useSiteSettings()
  const configured = settings.contact.socialLinks?.filter((x) => x.visible) ?? []
  const list = settings.contact.socialVisible
    ? configured.map((x) => ({ href: x.href, label: x.label, Icon: iconFor(x.iconId) }))
    : []

  if (list.length === 0) return null

  return (
    <nav aria-label="Social profiles" className={cn('flex flex-wrap gap-2', className)}>
      {list.map((item) => (
        <SocialLink key={item.label} {...item} />
      ))}
    </nav>
  )
}
