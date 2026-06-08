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

// Default social links when none are configured
const DEFAULT_SOCIAL_LINKS = [
  { href: 'https://instagram.com', label: 'Instagram', iconId: 'instagram', visible: true },
  { href: 'https://tiktok.com', label: 'TikTok', iconId: 'tiktok', visible: true },
  { href: 'https://youtube.com', label: 'YouTube', iconId: 'youtube', visible: true },
  { href: 'https://linkedin.com', label: 'LinkedIn', iconId: 'linkedin', visible: true },
  { href: 'https://t.me', label: 'Telegram', iconId: 'telegram', visible: true },
]

type SocialLinkType = {
  href: string
  label: string
  iconId: string
  visible?: boolean
}

export function ContactSocialRow({ className }: { className?: string }) {
  const { settings, ready } = useSiteSettings()
  
  // Show loading state
  if (!ready) {
    return <div className={cn("flex flex-wrap gap-2", className)}>Loading...</div>
  }
  
  // Safely access contact settings with fallback
  const contact = (settings as any)?.contact || {}
  
  // Get social links with defaults
  const socialLinks = (contact.socialLinks as SocialLinkType[]) || DEFAULT_SOCIAL_LINKS
  const configured = socialLinks.filter((x: SocialLinkType) => x.visible !== false && x.href?.trim())
  
  // Check if social section should be visible
  const socialVisible = contact.socialVisible !== false
  
  const list = socialVisible
    ? configured.map((x: SocialLinkType) => ({ 
        href: x.href, 
        label: x.label, 
        Icon: iconFor(x.iconId) 
      }))
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