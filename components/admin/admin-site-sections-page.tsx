'use client'

import { useMemo } from 'react'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { SimpleForm, type Field } from '@/components/admin/simple-form'
import { useSiteSettings } from '@/hooks/use-site-settings'

function useHeroFields(): readonly Field[] {
  return useMemo(
    () => [
      { key: 'eyebrow', label: 'Eyebrow', kind: 'text' },
      { key: 'nameLine1', label: 'Name line 1', kind: 'text' },
      { key: 'nameLine2', label: 'Name line 2', kind: 'text' },
      { key: 'tagline', label: 'Tagline', kind: 'text' },
      { key: 'roleLine1', label: 'Role line 1', kind: 'text' },
      { key: 'roleLine2', label: 'Role line 2', kind: 'text' },
    ],
    [],
  )
}

function useFooterFields(): readonly Field[] {
  return useMemo(
    () => [
      { key: 'headline', label: 'Headline', kind: 'text' },
      { key: 'contactTitle', label: 'Contact title', kind: 'text' },
      { key: 'phone', label: 'Phone', kind: 'text' },
      { key: 'email', label: 'Email', kind: 'text' },
      { key: 'socialHandle', label: 'Social handle', kind: 'text' },
      { key: 'newsletterLine1', label: 'Newsletter line 1', kind: 'text' },
      { key: 'newsletterLine2', label: 'Newsletter line 2', kind: 'text' },
      { key: 'tagline', label: 'Footer tagline', kind: 'text' },
      { key: 'privacyHref', label: 'Privacy link', kind: 'text' },
      { key: 'creditPrefix', label: 'Credit prefix', kind: 'text' },
      { key: 'creditName', label: 'Credit name', kind: 'text' },
      { key: 'creditHref', label: 'Credit link', kind: 'text' },
    ],
    [],
  )
}

function useMarqueeFields(): readonly Field[] {
  return useMemo(
    () => [
      { key: 'label', label: 'Marquee label', kind: 'text' },
      { key: 'durationSec', label: 'Duration (seconds)', kind: 'text' },
    ],
    [],
  )
}

export function AdminSiteSectionsPage() {
  const { settings, patch } = useSiteSettings()

  const heroFields = useHeroFields()
  const footerFields = useFooterFields()
  const marqueeFields = useMarqueeFields()

  return (
    <AdminPageShell
      title="Site sections"
      description="Edit global hero/footer/marquee content used across the site."
    >
      <div className="grid grid-cols-1 gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <p className="text-sm font-semibold text-white">Hero</p>
          <p className="mt-1 text-sm text-white/65">
            Controls the main landing hero text (name, tagline, roles).
          </p>
          <div className="mt-5">
            <SimpleForm
              title=""
              fields={heroFields}
              initial={settings.hero as any}
              onSubmit={(values) => patch({ hero: values as any })}
              submitLabel="Save hero"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <p className="text-sm font-semibold text-white">Footer</p>
          <p className="mt-1 text-sm text-white/65">Controls the footer contact + newsletter block.</p>
          <div className="mt-5">
            <SimpleForm
              title=""
              fields={footerFields}
              initial={settings.footer as any}
              onSubmit={(values) => patch({ footer: values as any })}
              submitLabel="Save footer"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <p className="text-sm font-semibold text-white">Dual marquee</p>
          <p className="mt-1 text-sm text-white/65">Controls the dual scrolling marquee CTA.</p>
          <div className="mt-5">
            <SimpleForm
              title=""
              fields={marqueeFields}
              initial={
                {
                ...settings.dualMarquee,
                durationSec: String(settings.dualMarquee.durationSec),
                } as any
              }
              onSubmit={(values) => {
                const durationSec = Number((values as any).durationSec)
                patch({
                  dualMarquee: {
                    label: String((values as any).label ?? ''),
                    durationSec: Number.isFinite(durationSec) ? durationSec : 180,
                  },
                })
              }}
              submitLabel="Save marquee"
            />
          </div>
        </div>
      </div>
    </AdminPageShell>
  )
}

