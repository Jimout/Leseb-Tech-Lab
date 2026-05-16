import { isLegacyArchitectureCatalogFilters } from '@/lib/catalog-filter-ids'
import { isLegacyPortfolioSeoText } from '@/lib/seo/share-assets'
import {
  getDefaultPortfolioCatalogFilters,
  normalizePortfolioCatalogFiltersState,
  type SitePortfolioCatalogFilters,
} from '@/lib/portfolio-catalog-filters'
import { z } from 'zod'

import { SITE_BRAND_NAME } from '@/lib/site-brand'

export type SiteHeroSettings = {
  eyebrow: string
  nameLine1: string
  nameLine2: string
  tagline: string
  roleLine1: string
  roleLine2: string
  backdropLightSrc: string
  backdropDarkSrc: string
  whoAmIEyebrow: string
  whoAmIBody: string
  whoAmIButtonLabel: string
  whoAmIButtonHref: string
}

export type SiteFooterSettings = {
  headline: string
  contactTitle: string
  phone: string
  email: string
  socialHandle: string
  newsletterLine1: string
  newsletterLine2: string
  tagline: string
  privacyHref: string
  creditPrefix: string
  creditName: string
  creditHref: string
  logoLightSrc: string
  logoDarkSrc: string
  socialLinks: FooterSocialLink[]
}

export type FooterSocialIconId =
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'linkedin'
  | 'telegram'

export type FooterSocialLink = {
  id: string
  visible: boolean
  label: string
  href: string
  iconId: FooterSocialIconId
}

export function footerSocialLabel(iconId: FooterSocialIconId): string {
  switch (iconId) {
    case 'instagram':
      return 'Instagram'
    case 'tiktok':
      return 'TikTok'
    case 'youtube':
      return 'YouTube'
    case 'linkedin':
      return 'LinkedIn'
    case 'telegram':
      return 'Telegram'
  }
}

export type SiteDualMarqueeSettings = {
  label: string
  durationSec: number
}

export type AboutPageSettings = {
  metaTitle: string
  metaDescription: string
}

export type AboutHeroSettings = {
  visible: boolean
  eyebrow: string
  lines: string[]
  portraitSrc: string
  portraitAlt: string
}

export type AboutTimelineItem = {
  id: string
  visible: boolean
  title: string
  detail: string
  description?: string
}

export type AboutToolkitIcon = {
  id: string
  visible: boolean
  src: string
  alt: string
}

export type AboutToolkitSection = {
  id: string
  visible: boolean
  label: string
  icons: AboutToolkitIcon[]
}

export type AboutProfessionalJourneySettings = {
  visible: boolean
  headingName: string
  headingRole: string
  intro: string
  cvHref: string
  educationVisible: boolean
  experienceVisible: boolean
  certificationsVisible: boolean
  toolkitVisible: boolean
  education: AboutTimelineItem[]
  experience: AboutTimelineItem[]
  certifications: AboutTimelineItem[]
  toolkitSections: AboutToolkitSection[]
  /** @deprecated Legacy categories kept for backward compatibility/migration only. */
  toolkitDesign: AboutToolkitIcon[]
  /** @deprecated Legacy categories kept for backward compatibility/migration only. */
  toolkitVisualization: AboutToolkitIcon[]
  /** @deprecated Legacy categories kept for backward compatibility/migration only. */
  toolkitGraphics: AboutToolkitIcon[]
  /** @deprecated Legacy categories kept for backward compatibility/migration only. */
  toolkitMedia: AboutToolkitIcon[]
}

export type AboutVenturesLogo = {
  id: string
  visible: boolean
  src: string
  alt: string
  href?: string
}

export type AboutAssociatedVenturesSettings = {
  visible: boolean
  ctaVisible: boolean
  headlineLines: string[]
  logos: AboutVenturesLogo[]
  ctaHeadingLines: string[]
  ctaButtonLabel: string
  ctaHref: string
  signatureName: string
}

export type ContactPageSettings = {
  metaTitle: string
  metaDescription: string
  introLine1: string
  introLine2: string
  email: string
  formVisible: boolean
  formSubmitLabel: string
  privacyPolicyHref: string
  newsletterOptInVisible: boolean
  newsletterOptInLabel: string
  formFields: ContactFormField[]
  socialVisible: boolean
  socialLinks: ContactSocialLink[]
}

export type ContactFieldKind =
  | 'text'
  | 'email'
  | 'tel'
  | 'textarea'

export type ContactFormField = {
  id: string
  visible: boolean
  name: string
  label: string
  kind: ContactFieldKind
  placeholder?: string
  required?: boolean
}

export type ContactSocialIconId =
  | 'instagram'
  | 'tiktok'
  | 'linkedin'
  | 'telegram'
  | 'youtube'

export type ContactSocialLink = {
  id: string
  visible: boolean
  label: string
  href: string
  iconId: ContactSocialIconId
}

export type PrivacyPolicySettings = {
  /** Small label above the main title (e.g. “Privacy & data protection”). */
  eyebrow: string
  title: string
  /** Lead line in the right column (scrollable area on large screens). */
  intro: string
  /** Body copy; one paragraph per line in admin. */
  body: string
  updatedAtIso: string
}

/** Small mark image in the structured-insight table of contents header (theme-aware). */
export type SiteInsightTocSettings = {
  /** Shown when the site is in dark mode (or before hydration). */
  markDarkSrc: string
  /** Shown when the site is in light mode. */
  markLightSrc: string
  markAlt: string
}

export type SiteSettings = {
  hero: SiteHeroSettings
  footer: SiteFooterSettings
  dualMarquee: SiteDualMarqueeSettings
  about: AboutPageSettings
  aboutHero: AboutHeroSettings
  aboutJourney: AboutProfessionalJourneySettings
  aboutVentures: AboutAssociatedVenturesSettings
  contact: ContactPageSettings
  privacy: PrivacyPolicySettings
  insightToc: SiteInsightTocSettings
  /** Public filter bars: Work, Insights, Resources catalog. */
  portfolioCatalogFilters: SitePortfolioCatalogFilters
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  hero: {
    eyebrow: '(leseb)',
    nameLine1: 'Technology',
    nameLine2: 'built for humans.',
    tagline: 'We build with quiet clarity.',
    roleLine1: 'Architect',
    roleLine2: 'Creative Director',
    backdropLightSrc: '/images/leseb-hero.png',
    backdropDarkSrc: '/images/Natty Hero.png',
    whoAmIEyebrow: 'Who we are',
    whoAmIBody:
      "We're [[Leseb Tech Lab]]. A technology lab based in Addis Ababa, building software and AI that serve people across [[Community, Data, and Product Design.]]",
    whoAmIButtonLabel: 'About Leseb',
    whoAmIButtonHref: '#about-intro',
  },
  footer: {
    headline: 'Did you like what you saw?',
    contactTitle: 'Get in touch',
    phone: '+251 937 927441',
    email: 'hello@leseb.com',
    socialHandle: '@leseb',
    newsletterLine1: 'Subscribe to',
    newsletterLine2: 'our newsletter',
    tagline: 'Crafting Since 2020',
    privacyHref: '/privacy',
    creditPrefix: 'Designed and Developed by',
    creditName: 'Eden Tekeste',
    creditHref: '#',
    logoLightSrc: '/Leseb-logo.png',
    logoDarkSrc: '/Leseb-logo.png',
    socialLinks: [
      { id: 'f-ig', visible: true, label: 'Instagram', href: 'https://instagram.com', iconId: 'instagram' },
      { id: 'f-tt', visible: true, label: 'TikTok', href: 'https://tiktok.com', iconId: 'tiktok' },
      { id: 'f-yt', visible: true, label: 'YouTube', href: 'https://youtube.com', iconId: 'youtube' },
      { id: 'f-li', visible: true, label: 'LinkedIn', href: 'https://linkedin.com', iconId: 'linkedin' },
      { id: 'f-tg', visible: true, label: 'Telegram', href: 'https://t.me', iconId: 'telegram' },
    ],
  },
  dualMarquee: {
    label: "Let's work together.",
    durationSec: 180,
  },
  about: {
    metaTitle: `About — ${SITE_BRAND_NAME}`,
    metaDescription:
      'Leseb Tech Lab builds software, AI, and product design for communities across Ethiopia and beyond.',
  },
  aboutHero: {
    visible: true,
    eyebrow: 'About us',
    lines: [
      'We are a technology lab focused on software, AI,',
      'and product design, building tools that serve',
      'communities across Ethiopia and beyond.',
    ],
    portraitSrc: '/images/leseb-about.png',
    portraitAlt: 'Leseb graphic',
  },
  aboutJourney: {
    visible: true,
    headingName: SITE_BRAND_NAME,
    headingRole: 'Architect | Architectural Visualisation Specialist',
    intro:
      'A glimpse into our journey, shaping our expertise in software, AI, product design, and human-centered technology across local and international projects.',
    cvHref: '/downloads/Leseb-Tech-Lab-CV.pdf',
    educationVisible: true,
    experienceVisible: true,
    certificationsVisible: true,
    toolkitVisible: true,
    education: [
      {
        id: 'edu-1',
        visible: true,
        title: 'Data Science & Machine Learning',
        detail: 'AIX Africa | 2025 - Present',
      },
      {
        id: 'edu-2',
        visible: true,
        title: 'Bachelor of Architecture',
        detail: 'Addis Ababa University | 2019 - 2024',
      },
      {
        id: 'edu-3',
        visible: true,
        title: 'High School Diploma',
        detail: 'Abune Gorgorious Schools | 2015 - 2018',
      },
    ],
    experience: [
      {
        id: 'exp-1',
        visible: true,
        title: 'Project Architect & Architectural Visualization Specialist',
        detail: 'Persona Design Studio | Nov 2025 - Present',
        description:
          'Leading design development and visualization for U.S. based and local projects, producing permit drawings, interior designs, and high-quality renderings aligned with client goals and regulations.',
      },
      {
        id: 'exp-2',
        visible: true,
        title: 'Project Architect',
        detail: 'BKW Consulting Architects | Aug 2024 - Present',
        description:
          'Managing design and construction phases across residential, commercial, and institutional projects, collaborating with multidisciplinary teams to deliver precise and functional architectural solutions.',
      },
      {
        id: 'exp-3',
        visible: true,
        title: 'Brand & Graphic Designer',
        detail: 'Roha Digitals | Jul 2024 - Oct 2025',
        description:
          'Developed brand identities and digital experiences, working on UI/UX design and visual communication for various clients.',
      },
      {
        id: 'exp-4',
        visible: true,
        title: 'Freelance Architect & Interior Designer',
        detail: 'Self-Employed | May 2023 - Present',
        description:
          'Delivering architectural and interior design services for residential and commercial clients—from concept and spatial planning through documentation and visualization.',
      },
    ],
    certifications: [
      { id: 'cert-1', visible: true, title: 'ALX Ventures Founder Academy', detail: 'ALX Africa | 2025' },
      { id: 'cert-2', visible: true, title: 'Professional Development Skills', detail: 'ALX Africa | 2025' },
      { id: 'cert-3', visible: true, title: 'D.D.I Certificate', detail: '2023' },
      { id: 'cert-4', visible: true, title: 'Appreciation Certificate', detail: 'EiABC | 2023' },
    ],
    toolkitSections: [
      {
        id: 'toolkit-design',
        visible: true,
        label: 'Design',
        icons: [
          { id: 'd-1', visible: true, src: '/images/design/revit.png', alt: 'Revit' },
          { id: 'd-2', visible: true, src: '/images/design/Autocad.png', alt: 'AutoCAD' },
          { id: 'd-3', visible: true, src: '/images/design/Rhino%201.png', alt: 'Rhino' },
          { id: 'd-4', visible: true, src: '/images/design/sketchup.png', alt: 'SketchUp' },
        ],
      },
      {
        id: 'toolkit-visualization',
        visible: true,
        label: 'Visualization',
        icons: [
          { id: 'v-1', visible: true, src: '/images/visualization/3%20max.png', alt: '3ds Max' },
          { id: 'v-2', visible: true, src: '/images/visualization/Blender.png', alt: 'Blender' },
          { id: 'v-3', visible: true, src: '/images/visualization/D5.png', alt: 'D5 Render' },
          { id: 'v-4', visible: true, src: '/images/visualization/Unreal.png', alt: 'Unreal Engine' },
        ],
      },
      {
        id: 'toolkit-graphics',
        visible: true,
        label: 'Graphics',
        icons: [
          { id: 'g-1', visible: true, src: '/images/graphics/Illustrator.png', alt: 'Illustrator' },
          { id: 'g-2', visible: true, src: '/images/graphics/Indesign.png', alt: 'InDesign' },
          { id: 'g-3', visible: true, src: '/images/graphics/Photoshop.png', alt: 'Photoshop' },
        ],
      },
      {
        id: 'toolkit-media',
        visible: true,
        label: 'Media',
        icons: [
          { id: 'm-1', visible: true, src: '/images/media/Cupcut.png', alt: 'CapCut' },
          { id: 'm-2', visible: true, src: '/images/media/Davinci.png', alt: 'DaVinci Resolve' },
        ],
      },
    ],
    toolkitDesign: [
      { id: 'd-1', visible: true, src: '/images/design/revit.png', alt: 'Revit' },
      { id: 'd-2', visible: true, src: '/images/design/Autocad.png', alt: 'AutoCAD' },
      { id: 'd-3', visible: true, src: '/images/design/Rhino%201.png', alt: 'Rhino' },
      { id: 'd-4', visible: true, src: '/images/design/sketchup.png', alt: 'SketchUp' },
    ],
    toolkitVisualization: [
      { id: 'v-1', visible: true, src: '/images/visualization/3%20max.png', alt: '3ds Max' },
      { id: 'v-2', visible: true, src: '/images/visualization/Blender.png', alt: 'Blender' },
      { id: 'v-3', visible: true, src: '/images/visualization/D5.png', alt: 'D5 Render' },
      { id: 'v-4', visible: true, src: '/images/visualization/Unreal.png', alt: 'Unreal Engine' },
    ],
    toolkitGraphics: [
      { id: 'g-1', visible: true, src: '/images/graphics/Illustrator.png', alt: 'Illustrator' },
      { id: 'g-2', visible: true, src: '/images/graphics/Indesign.png', alt: 'InDesign' },
      { id: 'g-3', visible: true, src: '/images/graphics/Photoshop.png', alt: 'Photoshop' },
    ],
    toolkitMedia: [
      { id: 'm-1', visible: true, src: '/images/media/Cupcut.png', alt: 'CapCut' },
      { id: 'm-2', visible: true, src: '/images/media/Davinci.png', alt: 'DaVinci Resolve' },
    ],
  },
  aboutVentures: {
    visible: true,
    ctaVisible: true,
    headlineLines: [
      'Creative and experimental',
      'ventures we have co-founded',
      'across architecture, design,',
      'and technology.',
    ],
    logos: [
      { id: 'logo-1', visible: true, src: '/images/clogo/Nedf.png', alt: 'NEDF Studios', href: '' },
      { id: 'logo-2', visible: true, src: '/images/clogo/Roha.png', alt: 'Roha Digitals', href: '' },
      { id: 'logo-3', visible: true, src: '/images/clogo/Leseb.png', alt: 'Leseb Tech Lab', href: '' },
    ],
    ctaHeadingLines: ['Let’s Create Something', 'Amazing Together!'],
    ctaButtonLabel: 'Contact',
    ctaHref: '/contact',
    signatureName: SITE_BRAND_NAME,
  },
  contact: {
    metaTitle: `Contact | ${SITE_BRAND_NAME}`,
    metaDescription:
      'Contact Leseb Tech Lab for partnerships, product builds, and human-centered AI and software enquiries.',
    introLine1:
      'Tell us what you are building, who it is for, and your timeline. We read every message and respond with next steps.',
    introLine2: 'Prefer email?',
    email: 'hello@leseb.com',
    formVisible: true,
    formSubmitLabel: 'Send Message',
    privacyPolicyHref: '/privacy',
    newsletterOptInVisible: true,
    newsletterOptInLabel: 'Subscribe to our newsletter for all the latest updates',
    formFields: [
      {
        id: 'f-name',
        visible: true,
        name: 'name',
        label: 'Name',
        kind: 'text',
        placeholder: 'Name',
        required: true,
      },
      {
        id: 'f-email',
        visible: true,
        name: 'email',
        label: 'Email',
        kind: 'email',
        placeholder: 'Your Email',
        required: true,
      },
      {
        id: 'f-phone',
        visible: true,
        name: 'phone',
        label: 'Phone',
        kind: 'tel',
        placeholder: 'Phone',
        required: false,
      },
      {
        id: 'f-city',
        visible: true,
        name: 'city',
        label: 'City',
        kind: 'text',
        placeholder: 'City',
        required: false,
      },
      {
        id: 'f-project',
        visible: true,
        name: 'project',
        label: 'Project',
        kind: 'textarea',
        placeholder: 'Tell us about your project:',
        required: true,
      },
    ],
    socialVisible: true,
    socialLinks: [
      { id: 's-ig', visible: true, label: 'Instagram', href: 'https://instagram.com', iconId: 'instagram' },
      { id: 's-tt', visible: true, label: 'TikTok', href: 'https://tiktok.com', iconId: 'tiktok' },
      { id: 's-li', visible: true, label: 'LinkedIn', href: 'https://linkedin.com', iconId: 'linkedin' },
      { id: 's-tg', visible: true, label: 'Telegram', href: 'https://t.me', iconId: 'telegram' },
      { id: 's-yt', visible: true, label: 'YouTube', href: 'https://youtube.com', iconId: 'youtube' },
    ],
  },
  privacy: {
    eyebrow: 'Privacy & data protection',
    title: 'Privacy Policy',
    intro: 'Because your privacy is important to us.',
    body: [
      '1. Information we collect',
      `When you use this website (${SITE_BRAND_NAME} portfolio), including the contact form, newsletter signup, or project inquiries, we may collect the details you submit—such as your name, email address, and message. If we use analytics, we may also process limited technical data (for example device or browser type) in aggregate to understand how the site is used.`,
      '',
      '2. How we use your information',
      'We use this information to respond to you, operate and improve the site, and—only if you opt in—to send updates about work or services. We do not sell your personal data.',
      '',
      '3. Storage in your browser',
      'Some optional tools (for example a local admin preview) may save settings in your browser’s storage on your device only. That data stays on your machine unless you use a feature that explicitly sends it to a server.',
      '',
      '4. Your choices',
      'You can ask to access, correct, or delete personal data we hold by contacting us via the contact page. You can unsubscribe from marketing messages using the link in those emails when applicable.',
      '',
      '5. Changes',
      'We may update this policy from time to time. The “Last updated” note on this page will reflect the latest revision.',
    ].join('\n'),
    updatedAtIso: new Date().toISOString(),
  },
  insightToc: {
    markDarkSrc: '/Leseb-logo.png',
    markLightSrc: '/Leseb-logo.png',
    markAlt: 'Leseb Tech Lab',
  },
  portfolioCatalogFilters: getDefaultPortfolioCatalogFilters(),
}

const STORAGE_KEY = 'leseb:site-settings:v1'

/** Old privacy eyebrow copy — replaced on read so stored settings pick up professional wording. */
const LEGACY_PRIVACY_EYEBROW = 'The boring legal stuff'

/** Default hero intro before `[[accent]]` markers; migrate on read for existing localStorage. */
const LEGACY_HERO_WHO_AMI_BODY =
  "We're Leseb Tech Lab. A technology lab based in Addis Ababa, building software and AI that serve people across Community, Data, and Product Design."

const LEGACY_HERO_NAME_LINE_1 = 'Leseb'
const LEGACY_HERO_NAME_LINE_2 = 'Tech Lab'

const LEGACY_HERO_TAGLINE = 'I Design in Quiet Clarity.'
const LEGACY_WHO_AM_I_EYEBROW = 'Who am I?'
const LEGACY_ABOUT_HERO_EYEBROW = 'About Me'
const LEGACY_ABOUT_HERO_LINE_1 = 'I am an Architect focused on design development,'
const LEGACY_ABOUT_JOURNEY_INTRO =
  'A glimpse into my professional journey, shaping my expertise in architecture, BIM, and architectural visualization across local and international projects.'
const LEGACY_NEWSLETTER_LINE_2 = 'my newsletter'
const LEGACY_NEWSLETTER_OPT_IN = 'Subscribe to my newsletter for all the latest updates'
const LEGACY_CONTACT_PROJECT_PLACEHOLDER = 'Tell me about your project:'
const LEGACY_VENTURES_LINE_2 = 'Associated Ventures I’ve'
const LEGACY_ABOUT_META_DESCRIPTION =
  'Architect focused on design development, interiors, and visualization across multiple scales.'
const LEGACY_NEWSLETTER_SPLASH_LIGHT = '/images/newspaper%202.png'
const LEGACY_NEWSLETTER_SPLASH_DARK = '/images/newspaper%201.png'
const LEGACY_FOOTER_LOGO = '/images/Logo.png'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * localStorage merges replace `footer.socialLinks` arrays wholesale, so new defaults (e.g. YouTube)
 * disappear. Rebuild the list from the canonical default order and overlay saved rows by `iconId`.
 */
function normalizeFooterSocialLinks(saved: FooterSocialLink[]): FooterSocialLink[] {
  const validIds: FooterSocialIconId[] = [
    'instagram',
    'tiktok',
    'youtube',
    'linkedin',
    'telegram',
  ]
  const validSet = new Set<FooterSocialIconId>(validIds)
  const used = new Set<FooterSocialIconId>()
  const normalized: FooterSocialLink[] = []

  for (const item of saved) {
    if (!item || !validSet.has(item.iconId) || used.has(item.iconId)) continue
    used.add(item.iconId)
    normalized.push({
      id: item.id || `f-${item.iconId}`,
      visible: true,
      href: typeof item.href === 'string' ? item.href : '',
      iconId: item.iconId,
      label: footerSocialLabel(item.iconId),
    })
  }

  return normalized
}

const footerImageSrcSchema = z
  .string()
  .trim()
  .regex(
    /^(https?:\/\/|\/|\.\/|\.\.\/)/i,
    'Footer image source must be an https URL or path.',
  )

const dualMarqueeDurationSchema = z
  .number()
  .finite()
  .min(30)
  .max(1200)

const privacyNonEmptyTextSchema = z
  .string()
  .trim()
  .min(1)

const privacyUpdatedAtIsoSchema = z
  .string()
  .datetime({ offset: true })

/**
 * Footer logo fields are free-form strings in admin. Keep only usable image-like paths/URLs;
 * otherwise fall back to defaults so the public footer splash never breaks.
 */
function normalizeFooterLogoSrc(
  value: unknown,
  fallback: string,
): string {
  if (typeof value !== 'string') return fallback
  const src = value.trim()
  if (!src) return fallback
  return footerImageSrcSchema.parse(src)
}

function normalizeDualMarqueeSettings(value: SiteDualMarqueeSettings): SiteDualMarqueeSettings {
  const rawLabel = typeof value.label === 'string' ? value.label.trim() : ''
  const label = rawLabel || DEFAULT_SITE_SETTINGS.dualMarquee.label
  const parsedDuration = dualMarqueeDurationSchema.safeParse(value.durationSec)
  const durationSec = parsedDuration.success
    ? parsedDuration.data
    : DEFAULT_SITE_SETTINGS.dualMarquee.durationSec
  return { label, durationSec }
}

function normalizeInsightTocSettings(value: SiteInsightTocSettings): SiteInsightTocSettings {
  const def = DEFAULT_SITE_SETTINGS.insightToc
  return {
    markDarkSrc: normalizeFooterLogoSrc(value.markDarkSrc, def.markDarkSrc),
    markLightSrc: normalizeFooterLogoSrc(value.markLightSrc, def.markLightSrc),
    markAlt: (typeof value.markAlt === 'string' ? value.markAlt.trim() : '') || def.markAlt,
  }
}

function normalizePrivacySettings(value: PrivacyPolicySettings): PrivacyPolicySettings {
  const def = DEFAULT_SITE_SETTINGS.privacy
  const eyebrow = privacyNonEmptyTextSchema.safeParse(value.eyebrow)
  const title = privacyNonEmptyTextSchema.safeParse(value.title)
  const intro = privacyNonEmptyTextSchema.safeParse(value.intro)
  const body = privacyNonEmptyTextSchema.safeParse(value.body)
  const updatedAtIso = privacyUpdatedAtIsoSchema.safeParse(value.updatedAtIso)

  return {
    eyebrow: eyebrow.success ? eyebrow.data : def.eyebrow,
    title: title.success ? title.data : def.title,
    intro: intro.success ? intro.data : def.intro,
    body: body.success ? body.data : def.body,
    updatedAtIso: updatedAtIso.success ? updatedAtIso.data : def.updatedAtIso,
  }
}

export function mergeDeep<T>(base: T, patch: Partial<T>): T {
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) }
  for (const [k, v] of Object.entries(patch as any)) {
    if (v === undefined) continue
    const prev = (base as any)[k]
    if (isPlainObject(prev) && isPlainObject(v)) out[k] = mergeDeep(prev, v)
    else out[k] = v
  }
  return out
}

/**
 * Merge stored JSON with defaults, apply legacy migrations, normalize footer links.
 * Used for DB payloads, API bodies, and legacy localStorage.
 */
export function normalizeStoredSiteSettings(raw: unknown): SiteSettings {
  if (!isPlainObject(raw)) return DEFAULT_SITE_SETTINGS
  const merged = mergeDeep(DEFAULT_SITE_SETTINGS, raw as Partial<SiteSettings>)
  let next = merged
  if (merged.hero.whoAmIBody === LEGACY_HERO_WHO_AMI_BODY) {
    next = {
      ...next,
      hero: { ...next.hero, whoAmIBody: DEFAULT_SITE_SETTINGS.hero.whoAmIBody },
    }
  }
  if (next.hero.tagline === LEGACY_HERO_TAGLINE) {
    next = { ...next, hero: { ...next.hero, tagline: DEFAULT_SITE_SETTINGS.hero.tagline } }
  }
  if (next.hero.whoAmIEyebrow === LEGACY_WHO_AM_I_EYEBROW) {
    next = { ...next, hero: { ...next.hero, whoAmIEyebrow: DEFAULT_SITE_SETTINGS.hero.whoAmIEyebrow } }
  }
  if (next.footer.newsletterLine2 === LEGACY_NEWSLETTER_LINE_2) {
    next = {
      ...next,
      footer: { ...next.footer, newsletterLine2: DEFAULT_SITE_SETTINGS.footer.newsletterLine2 },
    }
  }
  if (next.aboutHero.eyebrow === LEGACY_ABOUT_HERO_EYEBROW) {
    next = {
      ...next,
      aboutHero: { ...next.aboutHero, eyebrow: DEFAULT_SITE_SETTINGS.aboutHero.eyebrow },
    }
  }
  if (next.aboutHero.lines[0] === LEGACY_ABOUT_HERO_LINE_1) {
    next = {
      ...next,
      aboutHero: { ...next.aboutHero, lines: [...DEFAULT_SITE_SETTINGS.aboutHero.lines] },
    }
  }
  if (next.aboutJourney.intro === LEGACY_ABOUT_JOURNEY_INTRO) {
    next = {
      ...next,
      aboutJourney: { ...next.aboutJourney, intro: DEFAULT_SITE_SETTINGS.aboutJourney.intro },
    }
  }
  if (next.contact.newsletterOptInLabel === LEGACY_NEWSLETTER_OPT_IN) {
    next = {
      ...next,
      contact: { ...next.contact, newsletterOptInLabel: DEFAULT_SITE_SETTINGS.contact.newsletterOptInLabel },
    }
  }
  const projectField = next.contact.formFields.find((f) => f.name === 'project')
  if (projectField?.placeholder === LEGACY_CONTACT_PROJECT_PLACEHOLDER) {
    next = {
      ...next,
      contact: {
        ...next.contact,
        formFields: next.contact.formFields.map((f) =>
          f.name === 'project'
            ? { ...f, placeholder: DEFAULT_SITE_SETTINGS.contact.formFields.find((x) => x.name === 'project')!.placeholder }
            : f,
        ),
      },
    }
  }
  if (next.aboutVentures.headlineLines[1] === LEGACY_VENTURES_LINE_2) {
    next = {
      ...next,
      aboutVentures: {
        ...next.aboutVentures,
        headlineLines: [...DEFAULT_SITE_SETTINGS.aboutVentures.headlineLines],
      },
    }
  }
  if (next.about.metaDescription === LEGACY_ABOUT_META_DESCRIPTION) {
    next = {
      ...next,
      about: { ...next.about, metaDescription: DEFAULT_SITE_SETTINGS.about.metaDescription },
    }
  }
  if (isLegacyPortfolioSeoText(next.about.metaTitle)) {
    next = {
      ...next,
      about: { ...next.about, metaTitle: DEFAULT_SITE_SETTINGS.about.metaTitle },
    }
  }
  if (isLegacyPortfolioSeoText(next.about.metaDescription)) {
    next = {
      ...next,
      about: { ...next.about, metaDescription: DEFAULT_SITE_SETTINGS.about.metaDescription },
    }
  }
  if (isLegacyPortfolioSeoText(next.contact.metaTitle)) {
    next = {
      ...next,
      contact: { ...next.contact, metaTitle: DEFAULT_SITE_SETTINGS.contact.metaTitle },
    }
  }
  if (isLegacyPortfolioSeoText(next.contact.metaDescription)) {
    next = {
      ...next,
      contact: {
        ...next.contact,
        metaDescription: DEFAULT_SITE_SETTINGS.contact.metaDescription,
      },
    }
  }
  const newsletterLogoDefault = DEFAULT_SITE_SETTINGS.footer.logoLightSrc
  if (
    next.footer.logoLightSrc === LEGACY_NEWSLETTER_SPLASH_LIGHT ||
    next.footer.logoLightSrc === LEGACY_FOOTER_LOGO
  ) {
    next = { ...next, footer: { ...next.footer, logoLightSrc: newsletterLogoDefault } }
  }
  if (
    next.footer.logoDarkSrc === LEGACY_NEWSLETTER_SPLASH_DARK ||
    next.footer.logoDarkSrc === LEGACY_FOOTER_LOGO
  ) {
    next = { ...next, footer: { ...next.footer, logoDarkSrc: newsletterLogoDefault } }
  }
  if (
    merged.hero.nameLine1 === LEGACY_HERO_NAME_LINE_1 &&
    merged.hero.nameLine2 === LEGACY_HERO_NAME_LINE_2
  ) {
    next = {
      ...next,
      hero: {
        ...next.hero,
        nameLine1: DEFAULT_SITE_SETTINGS.hero.nameLine1,
        nameLine2: DEFAULT_SITE_SETTINGS.hero.nameLine2,
      },
    }
  }
  if (next.privacy.eyebrow === LEGACY_PRIVACY_EYEBROW) {
    next = {
      ...next,
      privacy: { ...next.privacy, eyebrow: DEFAULT_SITE_SETTINGS.privacy.eyebrow },
    }
  }
  const rawAboutJourney = isPlainObject(raw.aboutJourney) ? raw.aboutJourney : null
  const hasToolkitSections = Array.isArray(rawAboutJourney?.toolkitSections)
  const toolkitSections = hasToolkitSections
    ? next.aboutJourney.toolkitSections
    : [
        {
          id: 'toolkit-design',
          visible: true,
          label: 'Design',
          icons: next.aboutJourney.toolkitDesign,
        },
        {
          id: 'toolkit-visualization',
          visible: true,
          label: 'Visualization',
          icons: next.aboutJourney.toolkitVisualization,
        },
        {
          id: 'toolkit-graphics',
          visible: true,
          label: 'Graphics',
          icons: next.aboutJourney.toolkitGraphics,
        },
        {
          id: 'toolkit-media',
          visible: true,
          label: 'Media',
          icons: next.aboutJourney.toolkitMedia,
        },
      ]
  return {
    ...next,
    aboutJourney: {
      ...next.aboutJourney,
      toolkitSections,
    },
    dualMarquee: normalizeDualMarqueeSettings(next.dualMarquee),
    privacy: normalizePrivacySettings(next.privacy),
    insightToc: normalizeInsightTocSettings(next.insightToc),
    footer: {
      ...next.footer,
      logoLightSrc: normalizeFooterLogoSrc(next.footer.logoLightSrc, DEFAULT_SITE_SETTINGS.footer.logoLightSrc),
      logoDarkSrc: normalizeFooterLogoSrc(next.footer.logoDarkSrc, DEFAULT_SITE_SETTINGS.footer.logoDarkSrc),
      socialLinks: normalizeFooterSocialLinks(next.footer.socialLinks),
    },
    portfolioCatalogFilters: isLegacyArchitectureCatalogFilters(next.portfolioCatalogFilters.workInsights)
      ? getDefaultPortfolioCatalogFilters()
      : normalizePortfolioCatalogFiltersState(next.portfolioCatalogFilters),
  }
}

export function readSiteSettings(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SITE_SETTINGS
    const parsed = JSON.parse(raw) as unknown
    return normalizeStoredSiteSettings(parsed)
  } catch {
    return DEFAULT_SITE_SETTINGS
  }
}

export function writeSiteSettings(next: SiteSettings) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function patchSiteSettings(patch: Partial<SiteSettings>) {
  const current = readSiteSettings()
  writeSiteSettings(mergeDeep(current, patch))
}

