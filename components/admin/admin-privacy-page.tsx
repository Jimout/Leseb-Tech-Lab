'use client'

import { useEffect, useMemo, useState } from 'react'

import { AdminPageSaveCancelActions } from '@/components/admin/admin-page-save-cancel-actions'
import { AdminPrivacyEditorFields } from '@/components/admin/admin-privacy-editor-fields'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Card } from '@/components/ui/card'
import { useSiteSettings } from '@/hooks/use-site-settings'

// Default privacy content
const DEFAULT_PRIVACY = {
  eyebrow: 'Privacy Policy',
  title: 'Privacy Policy',
  intro: 'This Privacy Policy describes how we collect, use, and handle your information.',
  body: '<p>We are committed to protecting your privacy. This policy outlines our practices regarding data collection, use, and disclosure.</p><h2>Information Collection</h2><p>We collect information you provide directly to us.</p><h2>Use of Information</h2><p>We use the information to provide and improve our services.</p><h2>Contact Us</h2><p>If you have questions about this Privacy Policy, please contact us.</p>',
}

export function AdminPrivacyPage() {
  const { settings, patch, ready, saving } = useSiteSettings()
  
  // Extract privacy settings from the main settings object
  const privacySettings = useMemo(() => {
    const privacy = (settings as any)?.privacy || {}
    return {
      eyebrow: privacy.eyebrow || DEFAULT_PRIVACY.eyebrow,
      title: privacy.title || DEFAULT_PRIVACY.title,
      intro: privacy.intro || DEFAULT_PRIVACY.intro,
      body: privacy.body || DEFAULT_PRIVACY.body,
    }
  }, [settings])

  const [eyebrow, setEyebrow] = useState(privacySettings.eyebrow)
  const [title, setTitle] = useState(privacySettings.title)
  const [intro, setIntro] = useState(privacySettings.intro)
  const [body, setBody] = useState(privacySettings.body)

  // Update local state when settings change
  useEffect(() => {
    setEyebrow(privacySettings.eyebrow)
    setTitle(privacySettings.title)
    setIntro(privacySettings.intro)
    setBody(privacySettings.body)
  }, [privacySettings])

  const changed = useMemo(
    () =>
      eyebrow !== privacySettings.eyebrow ||
      title !== privacySettings.title ||
      intro !== privacySettings.intro ||
      body !== privacySettings.body,
    [eyebrow, title, intro, body, privacySettings],
  )

  const discard = () => {
    setEyebrow(privacySettings.eyebrow)
    setTitle(privacySettings.title)
    setIntro(privacySettings.intro)
    setBody(privacySettings.body)
  }

  const save = async () => {
    await patch({
      privacy: {
        eyebrow,
        title,
        intro,
        body,
        updatedAtIso: new Date().toISOString(),
      },
    })
  }

  if (!ready) {
    return (
      <AdminPageShell
        title="Privacy"
        description="Edit the Privacy Policy page content."
      >
        <Card className="rounded-2xl border-white/10 bg-white/5 p-5 sm:p-6">
          <div className="text-white/60">Loading privacy policy...</div>
        </Card>
      </AdminPageShell>
    )
  }

  return (
    <AdminPageShell
      title="Privacy"
      description="Edit the Privacy Policy page content."
      right={
        <AdminPageSaveCancelActions
          changed={changed && !saving}
          pageName="Privacy policy"
          publicPath="/privacy"
          saveTitle="Save privacy policy?"
          saveDescription="This will update the public /privacy page for all visitors."
          discardTitle="Discard privacy changes?"
          discardDescription="Unsaved edits to the privacy policy will be lost. All fields will reset to the last saved version."
          onSave={save}
          onDiscard={discard}
        />
      }
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