'use client'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { ContactPageSettings, ContactSocialIconId, ContactSocialLink } from '@/lib/admin/site-settings'

export const contactFieldClass = 'border-white/15 bg-white/5 text-white placeholder:text-white/40'

const SOCIAL_PLATFORMS: { iconId: ContactSocialIconId; label: string }[] = [
  { iconId: 'instagram', label: 'Instagram' },
  { iconId: 'tiktok', label: 'TikTok' },
  { iconId: 'linkedin', label: 'LinkedIn' },
  { iconId: 'telegram', label: 'Telegram' },
  { iconId: 'youtube', label: 'YouTube' },
]

export function AdminField({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-white/85">{label}</p>
      {hint ? <p className="text-xs leading-relaxed text-white/55">{hint}</p> : null}
      {children}
    </div>
  )
}

export function ContactHeroFields({
  value,
  onChange,
}: {
  value: ContactPageSettings
  onChange: (patch: Partial<ContactPageSettings>) => void
}) {
  return (
    <div className="space-y-5">
      <AdminField label="Eyebrow">
        <Input
          value={value.heroEyebrow}
          onChange={(e) => onChange({ heroEyebrow: e.target.value })}
          className={contactFieldClass}
        />
      </AdminField>
      <AdminField label="Headline — line 1">
        <Input
          value={value.heroLine1}
          onChange={(e) => onChange({ heroLine1: e.target.value })}
          className={contactFieldClass}
        />
      </AdminField>
      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField label="Headline — line 2">
          <Input
            value={value.heroLine2}
            onChange={(e) => onChange({ heroLine2: e.target.value })}
            className={contactFieldClass}
          />
        </AdminField>
        <AdminField label="Accent (italic)">
          <Input
            value={value.heroAccent}
            onChange={(e) => onChange({ heroAccent: e.target.value })}
            className={contactFieldClass}
          />
        </AdminField>
      </div>
      <AdminField label="Description (right side)">
        <Textarea
          value={value.heroDescription}
          rows={3}
          onChange={(e) => onChange({ heroDescription: e.target.value })}
          className={contactFieldClass}
        />
      </AdminField>
    </div>
  )
}

export function ContactEnquiriesFields({
  value,
  onChange,
}: {
  value: ContactPageSettings
  onChange: (patch: Partial<ContactPageSettings>) => void
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField label="Small label">
          <Input
            value={value.sectionKicker}
            onChange={(e) => onChange({ sectionKicker: e.target.value })}
            className={contactFieldClass}
          />
        </AdminField>
        <AdminField label="Section title">
          <Input
            value={value.sectionTitle}
            onChange={(e) => onChange({ sectionTitle: e.target.value })}
            className={contactFieldClass}
          />
        </AdminField>
      </div>
      <AdminField label="Intro paragraph">
        <Textarea
          value={value.introLine1}
          rows={4}
          onChange={(e) => onChange({ introLine1: e.target.value })}
          className={contactFieldClass}
        />
      </AdminField>
      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField label="Text before email">
          <Input
            value={value.introLine2}
            onChange={(e) => onChange({ introLine2: e.target.value })}
            className={contactFieldClass}
            placeholder="Prefer email?"
          />
        </AdminField>
        <AdminField label="Email">
          <Input
            value={value.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className={contactFieldClass}
            type="email"
          />
        </AdminField>
      </div>
      <AdminField label="Phone">
        <Input
          value={value.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          className={contactFieldClass}
          placeholder="+251 …"
        />
      </AdminField>
    </div>
  )
}

export function ContactFormFields({
  value,
  onChange,
}: {
  value: ContactPageSettings
  onChange: (patch: Partial<ContactPageSettings>) => void
}) {
  return (
    <div className="space-y-5">
      <p className="text-xs text-white/50">
        The form always includes name, email, phone, subject, and message. You only edit labels shown here.
      </p>
      <AdminField label="Message placeholder">
        <Input
          value={value.messagePlaceholder}
          onChange={(e) => onChange({ messagePlaceholder: e.target.value })}
          className={contactFieldClass}
        />
      </AdminField>
      <AdminField label="Submit button">
        <Input
          value={value.formSubmitLabel}
          onChange={(e) => onChange({ formSubmitLabel: e.target.value })}
          className={contactFieldClass}
        />
      </AdminField>
      <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-white/85">Newsletter checkbox</p>
          <Switch
            checked={value.newsletterOptInVisible}
            onCheckedChange={(newsletterOptInVisible) => onChange({ newsletterOptInVisible })}
          />
        </div>
        {value.newsletterOptInVisible ? (
          <Input
            value={value.newsletterOptInLabel}
            onChange={(e) => onChange({ newsletterOptInLabel: e.target.value })}
            className={contactFieldClass}
          />
        ) : null}
      </div>
    </div>
  )
}

export function ContactSocialFields({
  value,
  onChange,
}: {
  value: ContactPageSettings
  onChange: (patch: Partial<ContactPageSettings>) => void
}) {
  function linkFor(iconId: ContactSocialIconId) {
    return value.socialLinks.find((row) => row.iconId === iconId)
  }

  function updateLink(iconId: ContactSocialIconId, patch: Partial<ContactSocialLink>) {
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
        { id: `s-${iconId}`, visible: true, label: platform.label, href: '', iconId, ...patch },
      ],
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div>
          <p className="text-sm font-medium text-white/85">Elsewhere section</p>
          <p className="mt-1 text-xs text-white/55">Social icons under the intro text</p>
        </div>
        <Switch checked={value.socialVisible} onCheckedChange={(socialVisible) => onChange({ socialVisible })} />
      </div>

      {value.socialVisible ? (
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
                  className={contactFieldClass}
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
      ) : null}
    </div>
  )
}
