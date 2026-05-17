'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  AccentTextareaField,
  AdminField,
} from '@/components/admin/pages/about/about-editorial-editors'
import type { SiteHeroSettings } from '@/lib/admin/site-settings'

export const heroFieldClass = 'border-white/15 bg-white/5 text-white placeholder:text-white/40'

export function HeroHeadlineFields({
  value,
  onChange,
}: {
  value: SiteHeroSettings
  onChange: (patch: Partial<SiteHeroSettings>) => void
}) {
  return (
    <div className="space-y-5">
      <AdminField label="Eyebrow" hint="Small line above the main headline.">
        <Input
          value={value.eyebrow}
          onChange={(e) => onChange({ eyebrow: e.target.value })}
          className={heroFieldClass}
        />
      </AdminField>
      <AdminField label="Headline line 1">
        <Input
          value={value.nameLine1}
          onChange={(e) => onChange({ nameLine1: e.target.value })}
          className={heroFieldClass}
        />
      </AdminField>
      <AdminField label="Headline line 2" hint="Text before the accent phrase (e.g. “built ”).">
        <Input
          value={value.nameLine2}
          onChange={(e) => onChange({ nameLine2: e.target.value })}
          className={heroFieldClass}
        />
      </AdminField>
      <AdminField label="Headline accent" hint="Shown in signal color at the end of the headline.">
        <Input
          value={value.titleAccent}
          onChange={(e) => onChange({ titleAccent: e.target.value })}
          className={heroFieldClass}
        />
      </AdminField>
    </div>
  )
}

export function HeroIntroFields({
  value,
  onChange,
}: {
  value: SiteHeroSettings
  onChange: (patch: Partial<SiteHeroSettings>) => void
}) {
  return (
    <div className="space-y-5">
      <AdminField label="Kicker" hint="Label with the dot above the intro paragraph.">
        <Input
          value={value.whoAmIEyebrow}
          onChange={(e) => onChange({ whoAmIEyebrow: e.target.value })}
          className={heroFieldClass}
        />
      </AdminField>
      <AccentTextareaField
        label="Intro paragraph"
        hint="Use accent markers for highlighted phrases."
        value={value.whoAmIBody}
        rows={5}
        onChange={(whoAmIBody) => onChange({ whoAmIBody })}
      />
      <AdminField label="Button label">
        <Input
          value={value.whoAmIButtonLabel}
          onChange={(e) => onChange({ whoAmIButtonLabel: e.target.value })}
          className={heroFieldClass}
        />
      </AdminField>
      <AdminField label="Button link" hint="Path or URL (e.g. /about or #manifesto).">
        <Input
          value={value.whoAmIButtonHref}
          onChange={(e) => onChange({ whoAmIButtonHref: e.target.value })}
          className={heroFieldClass}
        />
      </AdminField>
    </div>
  )
}

export function HeroAsideFields({
  value,
  onChange,
}: {
  value: SiteHeroSettings
  onChange: (patch: Partial<SiteHeroSettings>) => void
}) {
  return (
    <div className="space-y-5">
      <AdminField label="Kicker" hint="Short label above the meta lines (right column on desktop).">
        <Input
          value={value.roleLine1}
          onChange={(e) => onChange({ roleLine1: e.target.value })}
          className={heroFieldClass}
        />
      </AdminField>
      <AdminField label="Meta lines" hint="Press Enter for a line break on the homepage.">
        <Textarea
          value={value.roleLine2}
          rows={3}
          onChange={(e) => onChange({ roleLine2: e.target.value })}
          className={heroFieldClass}
        />
      </AdminField>
    </div>
  )
}
