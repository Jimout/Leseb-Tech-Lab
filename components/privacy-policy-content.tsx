'use client'

import { useSiteSettings } from '@/hooks/use-site-settings'
import { privacyBodyLooksLikeHtml } from '@/lib/privacy-policy-body'
import {
  landingSectionKickerClass,
  landingSectionKickerDotClass,
} from '@/lib/landing-page-typography'
import { sanitizeInsightHtml } from '@/lib/sanitize-insight-html'
import { cn } from '@/lib/utils'

type PrivacySettings = {
  eyebrow?: string
  title?: string
  intro?: string
  body?: string
  updatedAtIso?: string
}

const DEFAULT_PRIVACY: PrivacySettings = {
  eyebrow: 'Privacy & data protection',
  title: 'Privacy Policy',
  intro: 'Because your privacy is important to us.',
  body: `
    <p>We are committed to protecting your privacy. This policy outlines our practices regarding data collection, use, and disclosure.</p>
    
    <h2>Information Collection</h2>
    <p>We collect information you provide directly to us, such as when you subscribe to our newsletter, fill out a contact form, or communicate with us.</p>
    
    <h2>Use of Information</h2>
    <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to monitor usage patterns.</p>
    
    <h2>Data Security</h2>
    <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
    
    <h2>Cookies</h2>
    <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information.</p>
    
    <h2>Contact Us</h2>
    <p>If you have questions about this Privacy Policy, please contact us at hello@leseb.com.</p>
  `,
}

function formatDate(iso?: string) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

function PrivacyBody({ text }: { text?: string }) {
  const trimmed = text?.trim()
  if (!trimmed) return null

  if (privacyBodyLooksLikeHtml(text || '')) {
    return (
      <div
        className={cn(
          'privacy-policy-prose max-w-none text-justify text-[15px] leading-[1.65] tracking-tight text-foreground/90 sm:text-base',
          'lg:text-[17px] lg:leading-relaxed xl:text-lg',
          '[&_a]:text-secondary [&_a]:underline [&_p]:mb-3 [&_ul]:mb-3 [&_ol]:mb-3',
          '[&_li]:my-0.5 [&_strong]:font-semibold',
        )}
        dangerouslySetInnerHTML={{ __html: sanitizeInsightHtml(trimmed) }}
      />
    )
  }

  return (
    <div className="space-y-0">
      {trimmed.split('\n').map((line, idx) =>
        line.trim() === '' ? (
          <div key={idx} className="h-3 sm:h-4" aria-hidden />
        ) : (
          <p
            key={idx}
            className={cn(
              'text-justify text-[15px] leading-[1.65] tracking-tight text-foreground/90 sm:text-base',
              'lg:text-[17px] lg:leading-relaxed xl:text-lg',
            )}
          >
            {line}
          </p>
        ),
      )}
    </div>
  )
}

const FALLBACK_EYEBROW = 'Privacy & data protection'
const FALLBACK_INTRO = 'Because your privacy is important to us.'

export function PrivacyPolicyContent() {
  const { settings, ready } = useSiteSettings()
  
  // Show loading state while settings are being fetched
  if (!ready) {
    return (
      <section className="py-12 sm:py-14 lg:py-16 xl:py-20 2xl:py-20">
        <div className="grid w-full min-w-0 gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-4">
            <div className="text-white/60">Loading privacy policy...</div>
          </div>
        </div>
      </section>
    )
  }
  
  // Safely get privacy settings from the main settings object
  const privacy = (settings as any)?.privacy as PrivacySettings | undefined
  
  // Use database values or fallback to defaults
  const eyebrow = privacy?.eyebrow?.trim() || DEFAULT_PRIVACY.eyebrow || FALLBACK_EYEBROW
  const title = privacy?.title?.trim() || DEFAULT_PRIVACY.title || 'Privacy Policy'
  const intro = privacy?.intro?.trim() || DEFAULT_PRIVACY.intro || FALLBACK_INTRO
  const body = privacy?.body?.trim() || DEFAULT_PRIVACY.body
  const updated = formatDate(privacy?.updatedAtIso)

  return (
    <section className="py-12 sm:py-14 lg:py-16 xl:py-20 2xl:py-20">
      <div
        className={cn(
          'grid w-full min-w-0 gap-10 sm:gap-12',
          'lg:min-h-[calc(100dvh-9rem)] lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0 xl:gap-x-14 2xl:gap-x-16 3xl:gap-x-20',
        )}
      >
        <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-4">
          <div className="lg:sticky lg:top-28 xl:top-32">
            <p className={landingSectionKickerClass}>
              <span className={landingSectionKickerDotClass} aria-hidden />
              {eyebrow}
            </p>
            <h1
              className={cn(
                'mt-4 text-balance font-sans font-semibold tracking-tight text-foreground',
                'text-4xl sm:text-5xl lg:text-5xl xl:text-6xl 2xl:text-6xl 3xl:text-7xl',
              )}
            >
              {title}
            </h1>
            {updated ? (
              <p className="mt-4 text-sm text-muted-foreground lg:text-[15px]">Last updated: {updated}</p>
            ) : null}
          </div>
        </div>

        <div
          className={cn(
            'min-w-0 lg:col-span-8 xl:col-span-8 2xl:col-span-8',
            'lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1 lg:overscroll-y-contain',
            'xl:max-h-[calc(100dvh-8.5rem)] 2xl:max-h-[calc(100dvh-9rem)]',
          )}
        >
          <p
            className={cn(
              'text-justify font-semibold tracking-tight text-foreground',
              'text-lg sm:text-xl lg:text-xl xl:text-2xl 2xl:text-2xl',
            )}
          >
            {intro}
          </p>
          <div className="mt-6 sm:mt-8">
            <PrivacyBody text={body} />
          </div>
        </div>
      </div>
    </section>
  )
}