'use client'

import Link from 'next/link'
import type { IconType } from 'react-icons/lib'
import { FaLinkedinIn } from 'react-icons/fa6'
import {
  SiInstagram,
  SiTelegram,
  SiTiktok,
  SiYoutube,
} from 'react-icons/si'

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

function SocialPill({ href, label, Icon }: { href: string; label: string; Icon: IconType }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-full sm:size-11',
        'bg-accent text-accent-foreground transition-opacity hover:opacity-90',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
      aria-label={label}
    >
      <Icon className="size-[1.05rem] sm:size-[1.15rem]" aria-hidden />
    </Link>
  )
}

export function ContactSocialRow({ className }: { className?: string }) {
  const { settings } = useSiteSettings()
  const configured = settings.contact.socialLinks?.filter((x) => x.visible) ?? []
  const list = settings.contact.socialVisible
    ? configured.map((x) => ({ href: x.href, label: x.label, Icon: iconFor(x.iconId) }))
    : []

  return (
    <nav aria-label="Social profiles" className={cn('flex flex-wrap gap-2.5 sm:gap-3', className)}>
      {list.map((item) => (
        <SocialPill key={item.label} {...item} />
      ))}
    </nav>
  )
}
