//app/components/admin/pages/about/about-journey-editors.tsx
'use client'

import { useId, useState } from 'react'

import { ImageUploadField } from '@/components/admin/image-upload-field'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ArrowDown, ArrowUp, Trash2, Upload } from 'lucide-react'
import type {
  AboutTimelineItem,
  AboutToolkitIcon,
  AboutToolkitSection,
  AboutProfessionalJourneySettings,
} from '@/lib/admin/site-settings'
import { cn } from '@/lib/utils'

function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function SectionHeader({
  title,
  subtitle,
  checked,
  onCheckedChange,
}: {
  title: string
  subtitle?: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{title}</p>
        {subtitle ? <p className="mt-1 text-sm text-white/65">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-xs text-white/60">
          Visible
        </Label>
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-white/85">{label}</p>
      {children}
    </div>
  )
}

function TextAreaLikeInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
    />
  )
}

function TimelineListEditor({
  title,
  subtitle,
  showDescription,
  enabled,
  onEnabledChange,
  items,
  onChange,
  idPrefix,
}: {
  title: string
  subtitle?: string
  showDescription?: boolean
  enabled: boolean
  onEnabledChange: (v: boolean) => void
  items: AboutTimelineItem[]
  onChange: (next: AboutTimelineItem[]) => void
  idPrefix: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <SectionHeader title={title} subtitle={subtitle} checked={enabled} onCheckedChange={onEnabledChange} />

      {enabled ? (
        <div className="mt-5 space-y-4">
          {items.map((it, idx) => (
            <div key={it.id} className="rounded-2xl border border-white/10 bg-[#1A1A1B] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={it.visible}
                    onCheckedChange={(v) =>
                      onChange(items.map((x) => (x.id === it.id ? { ...x, visible: v } : x)))
                    }
                  />
                  <p className="text-xs text-white/60">Visible</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      if (idx === 0) return
                      const copy = [...items]
                      const a = copy[idx - 1]
                      copy[idx - 1] = copy[idx]
                      copy[idx] = a
                      onChange(copy)
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
                      if (idx === items.length - 1) return
                      const copy = [...items]
                      const a = copy[idx + 1]
                      copy[idx + 1] = copy[idx]
                      copy[idx] = a
                      onChange(copy)
                    }}
                    disabled={idx === items.length - 1}
                    aria-label="Move down"
                  >
                    <ArrowDown className="size-4" aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onChange(items.filter((x) => x.id !== it.id))}
                    aria-label="Delete item"
                    title="Delete item"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Row label="Title">
                  <TextAreaLikeInput
                    value={it.title}
                    onChange={(v) => onChange(items.map((x) => (x.id === it.id ? { ...x, title: v } : x)))}
                  />
                </Row>
                <Row label="Detail">
                  <TextAreaLikeInput
                    value={it.detail}
                    onChange={(v) => onChange(items.map((x) => (x.id === it.id ? { ...x, detail: v } : x)))}
                  />
                </Row>
              </div>

              {showDescription ? (
                <div className="mt-4">
                  <Row label="Description">
                    <Textarea
                      value={it.description ?? ''}
                      rows={4}
                      onChange={(e) =>
                        onChange(
                          items.map((x) =>
                            x.id === it.id ? { ...x, description: e.target.value } : x,
                          ),
                        )
                      }
                      className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
                    />
                  </Row>
                </div>
              ) : null}
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              onChange([
                ...items,
                {
                  id: uid(idPrefix),
                  visible: true,
                  title: '',
                  detail: '',
                  description: showDescription ? '' : undefined,
                },
              ])
            }
          >
            Add item
          </Button>
        </div>
      ) : (
        <p className="mt-4 text-sm text-white/55">Hidden on the About page.</p>
      )}
    </div>
  )
}

function ToolkitSectionsEditor({
  enabled,
  onEnabledChange,
  sections,
  onChange,
}: {
  enabled: boolean
  onEnabledChange: (v: boolean) => void
  sections: AboutToolkitSection[]
  onChange: (next: AboutToolkitSection[]) => void
}) {
  const normalizedSections = sections.length
    ? sections
    : [
        {
          id: 'toolkit-design',
          visible: true,
          label: 'Design',
          icons: [],
        },
      ]
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <SectionHeader
        title="Toolkit"
        subtitle="Organize toolkit categories and icons. You can add unlimited categories."
        checked={enabled}
        onCheckedChange={onEnabledChange}
      />

      {enabled ? (
        <div className="mt-5 space-y-5">
          <Accordion type="multiple" defaultValue={[]} className="space-y-4">
            {normalizedSections.map((section, sectionIdx) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="rounded-2xl border border-white/10 bg-[#1A1A1B] px-0"
              >
                <div className="flex items-center justify-between gap-3 px-4 pt-4">
                  <AccordionTrigger className="py-0 text-left text-white hover:no-underline">
                    <span className="text-sm font-semibold text-white">
                      {section.label.trim() || 'Untitled category'} ({section.icons.length})
                    </span>
                  </AccordionTrigger>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={section.visible}
                      onCheckedChange={(v) =>
                        onChange(
                          normalizedSections.map((x) => (x.id === section.id ? { ...x, visible: v } : x)),
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        if (sectionIdx === 0) return
                        const copy = [...normalizedSections]
                        const a = copy[sectionIdx - 1]
                        copy[sectionIdx - 1] = copy[sectionIdx]
                        copy[sectionIdx] = a
                        onChange(copy)
                      }}
                      disabled={sectionIdx === 0}
                      aria-label="Move category up"
                    >
                      <ArrowUp className="size-4" aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        if (sectionIdx === normalizedSections.length - 1) return
                        const copy = [...normalizedSections]
                        const a = copy[sectionIdx + 1]
                        copy[sectionIdx + 1] = copy[sectionIdx]
                        copy[sectionIdx] = a
                        onChange(copy)
                      }}
                      disabled={sectionIdx === normalizedSections.length - 1}
                      aria-label="Move category down"
                    >
                      <ArrowDown className="size-4" aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onChange(normalizedSections.filter((x) => x.id !== section.id))}
                      aria-label="Delete category"
                      title="Delete category"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
                <AccordionContent className="px-4 pb-4">
                  <div className="mt-4">
                    <Row label="Category label">
                      <Input
                        value={section.label}
                        onChange={(e) =>
                          onChange(
                            normalizedSections.map((x) =>
                              x.id === section.id ? { ...x, label: e.target.value } : x,
                            ),
                          )
                        }
                        placeholder="Category label (e.g. BIM, AI, Web)"
                        className="h-9 min-w-56 border-white/15 bg-white/5 text-white placeholder:text-white/40"
                      />
                    </Row>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {section.icons.map((icon) => (
                    <div key={icon.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={icon.visible}
                            onCheckedChange={(v) =>
                              onChange(
                                normalizedSections.map((x) =>
                                  x.id === section.id
                                    ? {
                                        ...x,
                                        icons: x.icons.map((k) => (k.id === icon.id ? { ...k, visible: v } : k)),
                                      }
                                    : x,
                                ),
                              )
                            }
                          />
                          <p className="text-xs text-white/60">Visible</p>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            onChange(
                              normalizedSections.map((x) =>
                                x.id === section.id
                                  ? { ...x, icons: x.icons.filter((k) => k.id !== icon.id) }
                                  : x,
                              ),
                            )
                          }
                          aria-label="Delete icon"
                          title="Delete icon"
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </Button>
                      </div>
                      <div className="mt-4 space-y-3">
                        <Row label="Name (alt)">
                          <Input
                            value={icon.alt}
                            onChange={(e) =>
                              onChange(
                                normalizedSections.map((x) =>
                                  x.id === section.id
                                    ? {
                                        ...x,
                                        icons: x.icons.map((k) =>
                                          k.id === icon.id ? { ...k, alt: e.target.value } : k,
                                        ),
                                      }
                                    : x,
                                ),
                              )
                            }
                            className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
                          />
                        </Row>
                        <ImageUploadField
                          label="Icon image"
                          value={icon.src}
                          onChange={(src) =>
                            onChange(
                              normalizedSections.map((x) =>
                                x.id === section.id
                                  ? {
                                      ...x,
                                      icons: x.icons.map((k) => (k.id === icon.id ? { ...k, src } : k)),
                                    }
                                  : x,
                              ),
                            )
                          }
                          aspectClassName="aspect-square"
                          className={cn('[&>div:nth-child(3)]:max-w-40')}
                        />
                      </div>
                    </div>
                  ))}
                  </div>
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        onChange(
                          normalizedSections.map((x) =>
                            x.id === section.id
                              ? {
                                  ...x,
                                  icons: [...x.icons, { id: uid('tool-icon'), visible: true, src: '', alt: '' }],
                                }
                              : x,
                          ),
                        )
                      }
                    >
                      Add icon
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              onChange([
                ...normalizedSections,
                { id: uid('toolkit-section'), visible: true, label: '', icons: [] },
              ])
            }
          >
            Add category
          </Button>
        </div>
      ) : (
        <p className="mt-4 text-sm text-white/55">Hidden on the About page.</p>
      )}
    </div>
  )
}

export function AboutJourneyEditors({
  value,
  onChange,
}: {
  value: AboutProfessionalJourneySettings
  onChange: (next: AboutProfessionalJourneySettings) => void
}) {
  const [cvUploading, setCvUploading] = useState(false)
  const [cvUploadMessage, setCvUploadMessage] = useState<string | null>(null)

  async function uploadCvFromDevice(file: File) {
    setCvUploadMessage(null)
    setCvUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/uploads/cv', {
        method: 'POST',
        body: formData,
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setCvUploadMessage(data.error || 'CV upload failed.')
        return
      }

      onChange({ ...value, cvHref: data.url })
      setCvUploadMessage('CV uploaded. Link updated automatically.')
    } catch {
      setCvUploadMessage('CV upload failed. Please try again.')
    } finally {
      setCvUploading(false)
    }
  }

  return (
    <Accordion type="multiple" defaultValue={[]} className="space-y-3">
      <AccordionItem value="journey-overview" className="rounded-2xl border border-white/10 bg-white/5 px-0">
        <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
          Professional journey
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-6 sm:px-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <SectionHeader
              title="Professional journey"
              subtitle="Controls the timeline section (heading, intro, CV link, lists, and toolkit)."
              checked={value.visible}
              onCheckedChange={(v) => onChange({ ...value, visible: v })}
            />

            {value.visible ? (
              <div className="mt-5 grid grid-cols-1 gap-5">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <Row label="Name">
                    <Input
                      value={value.headingName}
                      onChange={(e) => onChange({ ...value, headingName: e.target.value })}
                      className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
                    />
                  </Row>
                  <Row label="Role line">
                    <Input
                      value={value.headingRole}
                      onChange={(e) => onChange({ ...value, headingRole: e.target.value })}
                      className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
                    />
                  </Row>
                </div>
                <Row label="Intro">
                  <Input
                    value={value.intro}
                    onChange={(e) => onChange({ ...value, intro: e.target.value })}
                    className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
                  />
                </Row>
                <Row label="Download CV file">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <Input id="about-cv-upload" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" disabled={cvUploading} onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        void uploadCvFromDevice(file)
                        e.target.value = ''
                      }} className="hidden" />
                      <Button type="button" variant="secondary" size="sm" className="h-8 w-8 p-0" asChild disabled={cvUploading}>
                        <label htmlFor="about-cv-upload" className="cursor-pointer" aria-label="Upload CV file" title="Upload CV file">
                          <Upload className="size-4" aria-hidden />
                        </label>
                      </Button>
                      <p className="text-xs text-white/55">
                        {cvUploading ? 'Uploading CV...' : 'Upload CV (.pdf, .doc, .docx)'}
                      </p>
                    </div>
                    {value.cvHref ? (
                      <p className="text-xs text-white/55">
                        Current file URL: <span className="text-white/75">{value.cvHref}</span>
                      </p>
                    ) : (
                      <p className="text-xs text-white/55">No CV uploaded yet.</p>
                    )}
                    {cvUploadMessage ? <p className="text-xs text-white/65">{cvUploadMessage}</p> : null}
                  </div>
                </Row>
              </div>
            ) : (
              <p className="mt-4 text-sm text-white/55">Hidden on the About page.</p>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="journey-education" className="rounded-2xl border border-white/10 bg-white/5 px-0">
        <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
          Education
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-6 sm:px-6">
          <TimelineListEditor
            title="Education"
            subtitle="Manage education items."
            enabled={value.educationVisible}
            onEnabledChange={(v) => onChange({ ...value, educationVisible: v })}
            items={value.education}
            onChange={(education) => onChange({ ...value, education })}
            idPrefix="edu"
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="journey-experience" className="rounded-2xl border border-white/10 bg-white/5 px-0">
        <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
          Professional Experience
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-6 sm:px-6">
          <TimelineListEditor
            title="Professional Experience"
            subtitle="Manage experience items."
            showDescription
            enabled={value.experienceVisible}
            onEnabledChange={(v) => onChange({ ...value, experienceVisible: v })}
            items={value.experience}
            onChange={(experience) => onChange({ ...value, experience })}
            idPrefix="exp"
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="journey-certifications" className="rounded-2xl border border-white/10 bg-white/5 px-0">
        <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
          Certifications
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-6 sm:px-6">
          <TimelineListEditor
            title="Certifications"
            subtitle="Manage certifications."
            enabled={value.certificationsVisible}
            onEnabledChange={(v) => onChange({ ...value, certificationsVisible: v })}
            items={value.certifications}
            onChange={(certifications) => onChange({ ...value, certifications })}
            idPrefix="cert"
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="journey-toolkit-design" className="rounded-2xl border border-white/10 bg-white/5 px-0">
        <AccordionTrigger className="px-5 py-4 text-white hover:no-underline sm:px-6">
          Toolkit
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-6 sm:px-6">
          <ToolkitSectionsEditor
            enabled={value.toolkitVisible}
            onEnabledChange={(v) => onChange({ ...value, toolkitVisible: v })}
            sections={
              value.toolkitSections?.length
                ? value.toolkitSections
                : [
                    {
                      id: 'toolkit-design',
                      visible: true,
                      label: 'Design',
                      icons: value.toolkitDesign,
                    },
                    {
                      id: 'toolkit-visualization',
                      visible: true,
                      label: 'Visualization',
                      icons: value.toolkitVisualization,
                    },
                    {
                      id: 'toolkit-graphics',
                      visible: true,
                      label: 'Graphics',
                      icons: value.toolkitGraphics,
                    },
                    {
                      id: 'toolkit-media',
                      visible: true,
                      label: 'Media',
                      icons: value.toolkitMedia,
                    },
                  ]
            }
            onChange={(toolkitSections) => onChange({ ...value, toolkitSections })}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

