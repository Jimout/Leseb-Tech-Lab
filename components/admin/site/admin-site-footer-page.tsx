'use client'

import { useEffect, useMemo, useState } from 'react'

import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ImageUploadField } from '@/components/admin/image-upload-field'
import { SimpleForm, type Field } from '@/components/admin/simple-form'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { footerSocialLabel, type SiteFooterSettings } from '@/lib/admin/site-settings'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
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

function isValidFooterImageSrc(value: string): boolean {
  const src = value.trim()
  if (!src) return false
  return /^(https?:\/\/|\/|\.\/|\.\.\/)/i.test(src)
}

export function AdminSiteFooterPage() {
  const { settings, patch } = useSiteSettings()
  const footerFields = useFooterFields()
  const [draft, setDraft] = useState<SiteFooterSettings>(settings.footer)

  useEffect(() => setDraft(settings.footer), [settings.footer])

  const changed = useMemo(() => JSON.stringify(draft) !== JSON.stringify(settings.footer), [draft, settings.footer])
  const lightLogoValid = isValidFooterImageSrc(draft.logoLightSrc)
  const darkLogoValid = isValidFooterImageSrc(draft.logoDarkSrc)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const pendingDelete = (draft.socialLinks ?? []).find((x) => x.id === deleteId) ?? null

  return (
    <AdminPageShell
      title="Footer"
      description="Edit footer contact + newsletter + social links."
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
                <AlertDialogDescription>This will revert footer edits back to the last saved values.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep editing</AlertDialogCancel>
                <AlertDialogAction onClick={() => setDraft(settings.footer)}>Discard</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={!changed}>Save</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Save footer?</AlertDialogTitle>
                <AlertDialogDescription>This will update the footer across the site.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => patch({ footer: draft as any })}>Save</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      }
    >
      <Accordion type="multiple" defaultValue={[]} className="space-y-3">
        <AccordionItem value="content" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            Footer content
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <SimpleForm
              title=""
              fields={footerFields}
              initial={draft as any}
              onSubmit={(values) => setDraft(values as any)}
              onChange={(values) => setDraft(values as any)}
              submitLabel={undefined}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="splash" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            Footer newsletter splash images
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <p className="text-sm text-white/65">
              Used in the newsletter splash image area of the footer (light and dark themes).
            </p>
            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ImageUploadField
                label="Light splash image"
                value={draft.logoLightSrc}
                onChange={(next) => setDraft((p) => ({ ...p, logoLightSrc: next }))}
                aspectClassName="aspect-16/9"
              />
              <ImageUploadField
                label="Dark splash image"
                value={draft.logoDarkSrc}
                onChange={(next) => setDraft((p) => ({ ...p, logoDarkSrc: next }))}
                aspectClassName="aspect-16/9"
              />
            </div>
            <div className="mt-4 space-y-1 text-xs">
              <p className={lightLogoValid ? 'text-emerald-300/85' : 'text-amber-300/90'}>
                Light image: {lightLogoValid ? 'valid source' : 'invalid/empty source (backend will use default).'}
              </p>
              <p className={darkLogoValid ? 'text-emerald-300/85' : 'text-amber-300/90'}>
                Dark image: {darkLogoValid ? 'valid source' : 'invalid/empty source (backend will use default).'}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="social" className="rounded-2xl border border-white/10 bg-white/5 px-0">
          <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
            Social icon links
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 sm:px-6">
            <p className="text-sm text-white/65">These icons show on the left rail of the footer.</p>

            <div className="mt-5 space-y-4">
              <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete social link?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {pendingDelete
                        ? `Remove ${footerSocialLabel(pendingDelete.iconId)} from the footer social rail?`
                        : 'Remove this social link from the footer social rail?'}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        if (!deleteId) return
                        setDraft((p) => ({ ...p, socialLinks: (p.socialLinks ?? []).filter((x) => x.id !== deleteId) }))
                        setDeleteId(null)
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {(draft.socialLinks ?? []).map((link, idx) => (
                <div key={link.id} className="rounded-2xl border border-white/10 bg-[#1A1A1B] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white/85">{footerSocialLabel(link.iconId)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        if (idx === 0) return
                        setDraft((p) => {
                          const list = [...(p.socialLinks ?? [])]
                          const a = list[idx - 1]
                          list[idx - 1] = list[idx]
                          list[idx] = a
                          return { ...p, socialLinks: list }
                        })
                      }}
                      disabled={idx === 0}
                      aria-label="Move up"
                    >
                      <ArrowUp className="size-4" aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setDraft((p) => {
                          const list = [...(p.socialLinks ?? [])]
                          if (idx >= list.length - 1) return p
                          const a = list[idx + 1]
                          list[idx + 1] = list[idx]
                          list[idx] = a
                          return { ...p, socialLinks: list }
                        })
                      }}
                      disabled={idx === (draft.socialLinks ?? []).length - 1}
                      aria-label="Move down"
                    >
                      <ArrowDown className="size-4" aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setDeleteId(link.id)}
                      aria-label="Delete social link"
                      title="Delete social link"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white/85">URL</p>
                    <Input
                      value={link.href}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          socialLinks: (p.socialLinks ?? []).map((x) =>
                            x.id === link.id ? { ...x, href: e.target.value } : x,
                          ),
                        }))
                      }
                      className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </AdminPageShell>
  )
}

