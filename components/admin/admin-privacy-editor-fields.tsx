'use client'

import { AdminRichTextEditor } from '@/components/admin/admin-rich-text-editor'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { privacyBodyToEditorHtml } from '@/lib/privacy-policy-body'

type Props = {
  eyebrow: string
  title: string
  intro: string
  body: string
  onEyebrow: (v: string) => void
  onTitle: (v: string) => void
  onIntro: (v: string) => void
  onBody: (v: string) => void
}

export function AdminPrivacyEditorFields({
  eyebrow,
  title,
  intro,
  body,
  onEyebrow,
  onTitle,
  onIntro,
  onBody,
}: Props) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="privacy-eyebrow" className="text-white/80">
          Eyebrow (left column)
        </Label>
        <Input
          id="privacy-eyebrow"
          value={eyebrow}
          onChange={(e) => onEyebrow(e.target.value)}
          className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
        />
      </div>
      <div className="mt-5 space-y-2">
        <Label htmlFor="privacy-title" className="text-white/80">
          Page title
        </Label>
        <Input
          id="privacy-title"
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
        />
      </div>
      <div className="mt-5 space-y-2">
        <Label htmlFor="privacy-intro" className="text-white/80">
          Intro (right column lead)
        </Label>
        <Input
          id="privacy-intro"
          value={intro}
          onChange={(e) => onIntro(e.target.value)}
          className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
        />
      </div>
      <div className="mt-5 space-y-2">
        <Label htmlFor="privacy-body" className="text-white/80">
          Body
        </Label>
        <p id="privacy-body-hint" className="text-xs text-white/50">
          Rich text: bold, lists, alignment, and accent colors. Existing plain-text policies load as paragraphs
          automatically.
        </p>
        <AdminRichTextEditor
          value={privacyBodyToEditorHtml(body)}
          onChange={onBody}
          minHeightClass="min-h-[320px]"
        />
      </div>
    </>
  )
}
