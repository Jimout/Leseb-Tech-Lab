'use client'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { AdminField } from '@/components/admin/pages/about/about-editorial-editors'
import { ImageUploadField } from '@/components/admin/image-upload-field'
import type { FooterSocialIconId, FooterSocialLink, SiteFooterSettings } from '@/lib/admin/site-settings'

export const footerFieldClass = 'border-white/15 bg-white/5 text-white placeholder:text-white/40'

const SOCIAL_PLATFORMS: { iconId: FooterSocialIconId; label: string }[] = [
  { iconId: 'instagram', label: 'Instagram' },
  { iconId: 'tiktok', label: 'TikTok' },
  { iconId: 'youtube', label: 'YouTube' },
  { iconId: 'linkedin', label: 'LinkedIn' },
  { iconId: 'telegram', label: 'Telegram' },
]

export function FooterWorkPanelFields({
  value,
  onChange,
}: {
  value: SiteFooterSettings
  onChange: (patch: Partial<SiteFooterSettings>) => void
}) {
  return (
    <div className="space-y-5">
      <AdminField label="Title line 1">
        <Input
          value={value.workPanelLine1}
          onChange={(e) => onChange({ workPanelLine1: e.target.value })}
          className={footerFieldClass}
        />
      </AdminField>
      <AdminField label="Title line 2">
        <Input
          value={value.workPanelLine2}
          onChange={(e) => onChange({ workPanelLine2: e.target.value })}
          className={footerFieldClass}
        />
      </AdminField>
      <AdminField label="Description" hint="Email is added automatically after this text.">
        <Textarea
          value={value.workPanelDescription}
          rows={3}
          onChange={(e) => onChange({ workPanelDescription: e.target.value })}
          className={footerFieldClass}
        />
      </AdminField>
    </div>
  )
}

export function FooterAboutPanelFields({
  value,
  onChange,
}: {
  value: SiteFooterSettings
  onChange: (patch: Partial<SiteFooterSettings>) => void
}) {
  return (
    <div className="space-y-5">
      <AdminField label="Title line 1">
        <Input
          value={value.aboutPanelLine1}
          onChange={(e) => onChange({ aboutPanelLine1: e.target.value })}
          className={footerFieldClass}
        />
      </AdminField>
      <AdminField label="Title line 2">
        <Input
          value={value.aboutPanelLine2}
          onChange={(e) => onChange({ aboutPanelLine2: e.target.value })}
          className={footerFieldClass}
        />
      </AdminField>
      <AdminField label="Description">
        <Textarea
          value={value.aboutPanelDescription}
          rows={3}
          onChange={(e) => onChange({ aboutPanelDescription: e.target.value })}
          className={footerFieldClass}
        />
      </AdminField>
    </div>
  )
}

export function FooterContactFields({
  value,
  onChange,
}: {
  value: SiteFooterSettings
  onChange: (patch: Partial<SiteFooterSettings>) => void
}) {
  return (
    <div className="space-y-5">
      <AdminField label="Intro line" hint="Shown above the email and phone in the dark footer block.">
        <Input
          value={value.contactIntro}
          onChange={(e) => onChange({ contactIntro: e.target.value })}
          className={footerFieldClass}
        />
      </AdminField>
      <AdminField label="Email">
        <Input
          value={value.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className={footerFieldClass}
        />
      </AdminField>
      <AdminField label="Phone" hint="Also used on the Contact page when its phone field is empty.">
        <Input
          value={value.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          className={footerFieldClass}
        />
      </AdminField>
      <AdminField label="Privacy page link">
        <Input
          value={value.privacyHref}
          onChange={(e) => onChange({ privacyHref: e.target.value })}
          className={footerFieldClass}
          placeholder="/privacy"
        />
      </AdminField>
    </div>
  )
}

export function FooterSocialFields({
  value,
  onChange,
}: {
  value: SiteFooterSettings
  onChange: (patch: Partial<SiteFooterSettings>) => void
}) {
  function linkFor(iconId: FooterSocialIconId) {
    return value.socialLinks.find((row) => row.iconId === iconId)
  }

  function updateLink(iconId: FooterSocialIconId, patch: Partial<FooterSocialLink>) {
    const existing = linkFor(iconId)
    if (existing) {
      onChange({
        socialLinks: value.socialLinks.map((row) => (row.iconId === iconId ? { ...row, ...patch } : row)),
      })
      return
    }
    const platform = SOCIAL_PLATFORMS.find((row) => row.iconId === iconId)!
    onChange({
      socialLinks: [
        ...value.socialLinks,
        { id: `f-${iconId}`, visible: true, label: platform.label, href: '', iconId, ...patch },
      ],
    })
  }

  return (
    <div className="divide-y divide-white/10 rounded-xl border border-white/10">
      {SOCIAL_PLATFORMS.map((platform) => {
        const row = linkFor(platform.iconId)
        const visible = row?.visible !== false
        return (
          <div
            key={platform.iconId}
            className="grid gap-3 p-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:gap-4"
          >
            <p className="text-sm font-medium text-white/80">{platform.label}</p>
            <Input
              value={row?.href ?? ''}
              disabled={!visible}
              onChange={(e) => updateLink(platform.iconId, { label: platform.label, href: e.target.value })}
              className={footerFieldClass}
              placeholder="https://"
            />
            <div className="flex items-center gap-2 sm:justify-end">
              <span className="text-xs text-white/50">On</span>
              <Switch
                checked={visible}
                onCheckedChange={(checked) => updateLink(platform.iconId, { visible: checked })}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function FooterNewsletterBannerFields({
  value,
  onChange,
}: {
  value: SiteFooterSettings
  onChange: (patch: Partial<SiteFooterSettings>) => void
}) {
  return (
    <div className="space-y-5">
      <p className="text-xs leading-relaxed text-white/55">
        These fields power the newsletter section on the homepage, not the footer contact form.
      </p>
      <AdminField label="Heading line 1">
        <Input
          value={value.newsletterLine1}
          onChange={(e) => onChange({ newsletterLine1: e.target.value })}
          className={footerFieldClass}
        />
      </AdminField>
      <AdminField label="Heading line 2" hint="Shown in accent color on the banner.">
        <Input
          value={value.newsletterLine2}
          onChange={(e) => onChange({ newsletterLine2: e.target.value })}
          className={footerFieldClass}
        />
      </AdminField>
      <ImageUploadField
        label="Banner image"
        value={value.newsletterBannerSrc}
        onChange={(newsletterBannerSrc) => onChange({ newsletterBannerSrc })}
        aspectClassName="aspect-16/9"
      />
    </div>
  )
}
