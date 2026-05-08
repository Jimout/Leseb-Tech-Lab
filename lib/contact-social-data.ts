import type { IconType } from 'react-icons/lib'
import { FaLinkedinIn } from 'react-icons/fa6'
import { SiInstagram, SiTelegram, SiTiktok, SiYoutube } from 'react-icons/si'

export type ContactSocialItem = {
  href: string
  label: string
  Icon: IconType
}

/** Social row for the contact page (matches reference layout). */
export const CONTACT_SOCIAL_LINKS: ContactSocialItem[] = [
  { href: 'https://instagram.com', label: 'Instagram', Icon: SiInstagram },
  { href: 'https://tiktok.com', label: 'TikTok', Icon: SiTiktok },
  { href: 'https://linkedin.com', label: 'LinkedIn', Icon: FaLinkedinIn },
  { href: 'https://t.me', label: 'Telegram', Icon: SiTelegram },
  { href: 'https://youtube.com', label: 'YouTube', Icon: SiYoutube },
]
