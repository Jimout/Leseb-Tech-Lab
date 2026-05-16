'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ContactFormFieldsEditor, ContactSocialLinksEditor } from '@/components/admin/pages/contact/contact-editors'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useSiteSettings } from '@/hooks/use-site-settings'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-white/85">{label}</p>
      {children}
    </div>
  )
}

export function AdminContactManagerPage() {
  const { settings, patch, ready } = useSiteSettings()
  const hydrated = useRef(false)

  const [metaTitle, setMetaTitle] = useState(settings.contact.metaTitle)
  const [metaDescription, setMetaDescription] = useState(settings.contact.metaDescription)
  const [introLine1, setIntroLine1] = useState(settings.contact.introLine1)
  const [introLine2, setIntroLine2] = useState(settings.contact.introLine2)
  const [email, setEmail] = useState(settings.contact.email)
  const [formVisible, setFormVisible] = useState(settings.contact.formVisible)
  const [formSubmitLabel, setFormSubmitLabel] = useState(settings.contact.formSubmitLabel)
  const [newsletterOptInVisible, setNewsletterOptInVisible] = useState(settings.contact.newsletterOptInVisible)
  const [newsletterOptInLabel, setNewsletterOptInLabel] = useState(settings.contact.newsletterOptInLabel)
  const [formFields, setFormFields] = useState(settings.contact.formFields)
  const [socialVisible, setSocialVisible] = useState(settings.contact.socialVisible)
  const [socialLinks, setSocialLinks] = useState(settings.contact.socialLinks)

  useEffect(() => {
    if (!ready || hydrated.current) return
    hydrated.current = true
    const c = settings.contact
    setMetaTitle(c.metaTitle)
    setMetaDescription(c.metaDescription)
    setIntroLine1(c.introLine1)
    setIntroLine2(c.introLine2)
    setEmail(c.email)
    setFormVisible(c.formVisible)
    setFormSubmitLabel(c.formSubmitLabel)
    setNewsletterOptInVisible(c.newsletterOptInVisible)
    setNewsletterOptInLabel(c.newsletterOptInLabel)
    setFormFields(c.formFields)
    setSocialVisible(c.socialVisible)
    setSocialLinks(c.socialLinks)
  }, [ready, settings.contact])

  const changed = useMemo(() => {
    return (
      metaTitle !== settings.contact.metaTitle ||
      metaDescription !== settings.contact.metaDescription ||
      introLine1 !== settings.contact.introLine1 ||
      introLine2 !== settings.contact.introLine2 ||
      email !== settings.contact.email ||
      formVisible !== settings.contact.formVisible ||
      formSubmitLabel !== settings.contact.formSubmitLabel ||
      newsletterOptInVisible !== settings.contact.newsletterOptInVisible ||
      newsletterOptInLabel !== settings.contact.newsletterOptInLabel ||
      formFields !== settings.contact.formFields ||
      socialVisible !== settings.contact.socialVisible ||
      socialLinks !== settings.contact.socialLinks
    )
  }, [
    email,
    introLine1,
    introLine2,
    metaDescription,
    metaTitle,
    formFields,
    formSubmitLabel,
    formVisible,
    newsletterOptInLabel,
    newsletterOptInVisible,
    socialLinks,
    socialVisible,
    settings.contact.email,
    settings.contact.introLine1,
    settings.contact.introLine2,
    settings.contact.formFields,
    settings.contact.formSubmitLabel,
    settings.contact.formVisible,
    settings.contact.newsletterOptInLabel,
    settings.contact.newsletterOptInVisible,
    settings.contact.metaDescription,
    settings.contact.metaTitle,
    settings.contact.socialLinks,
    settings.contact.socialVisible,
  ])

  return (
    <AdminPageShell
      title="Contact page"
      description="Manage Contact page metadata, form fields, and social links."
      right={
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" disabled={!changed}>
                Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will revert the Contact page fields back to the last saved values.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep editing</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setMetaTitle(settings.contact.metaTitle)
                    setMetaDescription(settings.contact.metaDescription)
                    setIntroLine1(settings.contact.introLine1)
                    setIntroLine2(settings.contact.introLine2)
                    setEmail(settings.contact.email)
                    setFormVisible(settings.contact.formVisible)
                    setFormSubmitLabel(settings.contact.formSubmitLabel)
                    setNewsletterOptInVisible(settings.contact.newsletterOptInVisible)
                    setNewsletterOptInLabel(settings.contact.newsletterOptInLabel)
                    setFormFields(settings.contact.formFields)
                    setSocialVisible(settings.contact.socialVisible)
                    setSocialLinks(settings.contact.socialLinks)
                  }}
                >
                  Discard
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={!changed}>Save</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Save Contact page?</AlertDialogTitle>
                <AlertDialogDescription>
                  This saves to the server and updates the live{' '}
                  <span className="text-white/80">/contact</span> page for everyone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    patch({
                      contact: {
                        metaTitle,
                        metaDescription,
                        introLine1,
                        introLine2,
                        email,
                        formVisible,
                        formSubmitLabel,
                        privacyPolicyHref: '/privacy',
                        newsletterOptInVisible,
                        newsletterOptInLabel,
                        formFields,
                        socialVisible,
                        socialLinks,
                      },
                    })
                  }
                >
                  Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      }
    >
      <Card className="rounded-2xl border-white/10 bg-white/5 p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-8">
          <Row label="Meta title">
            <Input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
            />
          </Row>
          <Row label="Meta description">
            <Input
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
            />
          </Row>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Row label="Intro line 1">
              <Input
                value={introLine1}
                onChange={(e) => setIntroLine1(e.target.value)}
                className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
              />
            </Row>
            <Row label="Intro line 2">
              <Input
                value={introLine2}
                onChange={(e) => setIntroLine2(e.target.value)}
                className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
              />
            </Row>
          </div>

          <Row label="Contact email">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
            />
          </Row>

          <div className="rounded-2xl border border-white/10 bg-background/20 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white/90">Contact form</p>
              <div className="flex items-center gap-3">
                <p className="text-xs text-white/60">Visible</p>
                <Switch checked={formVisible} onCheckedChange={setFormVisible} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-5">
              <Row label="Submit button label">
                <Input
                  value={formSubmitLabel}
                  onChange={(e) => setFormSubmitLabel(e.target.value)}
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
              </Row>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white/90">Newsletter opt-in</p>
              <div className="flex items-center gap-3">
                <p className="text-xs text-white/60">Visible</p>
                <Switch checked={newsletterOptInVisible} onCheckedChange={setNewsletterOptInVisible} />
              </div>
            </div>
            <div className="mt-4">
              <Row label="Opt-in label">
                <Input
                  value={newsletterOptInLabel}
                  onChange={(e) => setNewsletterOptInLabel(e.target.value)}
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
              </Row>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-white/90">Fields</p>
              <div className="mt-4">
                <ContactFormFieldsEditor fields={formFields} onChange={setFormFields} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-background/20 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white/90">Social links</p>
              <div className="flex items-center gap-3">
                <p className="text-xs text-white/60">Visible</p>
                <Switch checked={socialVisible} onCheckedChange={setSocialVisible} />
              </div>
            </div>
            <p className="mt-1 text-xs text-white/55">
              Icon ids: instagram, tiktok, linkedin, telegram, youtube
            </p>
            <div className="mt-4">
              <ContactSocialLinksEditor links={socialLinks} onChange={setSocialLinks} />
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-white/55">
          Public page: <span className="text-white/75">/contact</span>
        </p>
      </Card>
    </AdminPageShell>
  )
}

