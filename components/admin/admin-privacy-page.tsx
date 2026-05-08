'use client'

import { useEffect, useMemo, useState } from 'react'

import { AdminPrivacyDialogActions } from '@/components/admin/admin-privacy-dialog-actions'
import { AdminPrivacyEditorFields } from '@/components/admin/admin-privacy-editor-fields'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Card } from '@/components/ui/card'
import { useSiteSettings } from '@/hooks/use-site-settings'

export function AdminPrivacyPage() {
  const { settings, patch } = useSiteSettings()
  const [eyebrow, setEyebrow] = useState(settings.privacy.eyebrow)
  const [title, setTitle] = useState(settings.privacy.title)
  const [intro, setIntro] = useState(settings.privacy.intro)
  const [body, setBody] = useState(settings.privacy.body)

  useEffect(() => {
    setEyebrow(settings.privacy.eyebrow)
    setTitle(settings.privacy.title)
    setIntro(settings.privacy.intro)
    setBody(settings.privacy.body)
  }, [
    settings.privacy.eyebrow,
    settings.privacy.title,
    settings.privacy.intro,
    settings.privacy.body,
  ])

  const changed = useMemo(
    () =>
      eyebrow !== settings.privacy.eyebrow ||
      title !== settings.privacy.title ||
      intro !== settings.privacy.intro ||
      body !== settings.privacy.body,
    [eyebrow, title, intro, body, settings.privacy],
  )

  const discard = () => {
    setEyebrow(settings.privacy.eyebrow)
    setTitle(settings.privacy.title)
    setIntro(settings.privacy.intro)
    setBody(settings.privacy.body)
  }

  const save = () =>
    patch({
      privacy: {
        eyebrow,
        title,
        intro,
        body,
        updatedAtIso: new Date().toISOString(),
      },
    })

  return (
    <AdminPageShell
      title="Privacy"
      description="Edit the Privacy Policy page content."
      right={<AdminPrivacyDialogActions changed={changed} onDiscard={discard} onSave={save} />}
    >
      <Card className="rounded-2xl border-white/10 bg-white/5 p-5 sm:p-6">
        <AdminPrivacyEditorFields
          eyebrow={eyebrow}
          title={title}
          intro={intro}
          body={body}
          onEyebrow={setEyebrow}
          onTitle={setTitle}
          onIntro={setIntro}
          onBody={setBody}
        />
        <p className="mt-4 text-xs text-white/55">
          Public page: <span className="text-white/75">/privacy</span>
        </p>
      </Card>
    </AdminPageShell>
  )
}
