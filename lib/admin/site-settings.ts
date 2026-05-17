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
  titleAccent: string
  whoAmIEyebrow: string
  whoAmIBody: string
  whoAmIButtonLabel: string
  whoAmIButtonHref: string
  roleLine1: string
  roleLine2: string
}

export type SiteFooterSettings = {
  workPanelLine1: string
  workPanelLine2: string
  workPanelDescription: string
  aboutPanelLine1: string
  aboutPanelLine2: string
  aboutPanelDescription: string
  contactIntro: string
  email: string
  phone: string
  privacyHref: string
  socialLinks: FooterSocialLink[]
  /** Used by the homepage newsletter banner (not the footer block). */
  newsletterLine1: string
  newsletterLine2: string
  newsletterBannerSrc: string
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

export type AboutEditorialPrinciple = {
  id: string
  visible: boolean
  numeral: string
  title: string
  body: string
}

/** Content for the public /about editorial layout. */
export type AboutEditorialContentSettings = {
  heroEyebrow: string
  heroLine1: string
  heroAccent: string
  letterSidebarLabel: string
  /** Sidebar note; one line per row (line break in admin). */
  letterSidebarMeta: string
  /** Large opening line — use [[text]] for accent color. */
  letterOpening: string
  /** Main letter copy — separate paragraphs with a blank line. */
  letterBody: string
  /** Sign-off line at the bottom of the letter. */
  letterSignOff: string
  principlesHeading: string
  principlesSubheading: string
  principles: AboutEditorialPrinciple[]
  foundersEyebrow: string
  foundersTitle: string
  foundersParagraphs: string[]
  ctaEyebrow: string
  ctaHeadingBefore: string
  ctaHeadingAccent: string
  ctaButtonLabel: string
  ctaHref: string
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
  heroEyebrow: string
  heroLine1: string
  heroLine2: string
  heroAccent: string
  heroDescription: string
  sectionKicker: string
  sectionTitle: string
  introLine1: string
  introLine2: string
  email: string
  phone: string
  formSubmitLabel: string
  messagePlaceholder: string
  newsletterOptInVisible: boolean
  newsletterOptInLabel: string
  socialVisible: boolean
  socialLinks: ContactSocialLink[]
  /** Kept for API compatibility — form is always shown when fields exist. */
  formVisible: boolean
  privacyPolicyHref: string
  formFields: ContactFormField[]
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

/** Small logo beside “Contents” on structured insight article pages. */
export type SiteInsightTocSettings = {
  markSrc: string
  markAlt: string
}

export type SiteSettings = {
  hero: SiteHeroSettings
  footer: SiteFooterSettings
  dualMarquee: SiteDualMarqueeSettings
  about: AboutPageSettings
  aboutEditorial: AboutEditorialContentSettings
  /** @deprecated Legacy About layout — kept for stored JSON compatibility. */
  aboutHero: AboutHeroSettings
  /** @deprecated Legacy About layout — kept for stored JSON compatibility. */
  aboutJourney: AboutProfessionalJourneySettings
  /** @deprecated Legacy About layout — kept for stored JSON compatibility. */
  aboutVentures: AboutAssociatedVenturesSettings
  contact: ContactPageSettings
  privacy: PrivacyPolicySettings
  insightToc: SiteInsightTocSettings
  /** Public filter bars: Work, Insights, Resources catalog. */
  portfolioCatalogFilters: SitePortfolioCatalogFilters
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  hero: {
    eyebrow: '(ለሰብ) / for humans',
    nameLine1: 'Technology',
    nameLine2: 'built ',
    titleAccent: 'for humans.',
    whoAmIEyebrow: 'What is Leseb?',
    whoAmIBody:
      '{{Leseb (ለሰብ)}} in Ge\'ez means [[for humans]] and that is the foundation of our identity. We design AI and software that serve people, never overwhelm them.',
    whoAmIButtonLabel: 'Read the Manifesto',
    whoAmIButtonHref: '#manifesto',
    roleLine1: 'Tech Lab · Est. 2025',
    roleLine2: 'Building human-centered AI\nfrom Addis Ababa to the world.',
  },
  footer: {
    workPanelLine1: "LET'S WORK",
    workPanelLine2: 'TOGETHER',
    workPanelDescription: 'Have an idea worth making real?',
    aboutPanelLine1: 'ABOUT',
    aboutPanelLine2: 'US',
    aboutPanelDescription: 'Learn more about our journey and what we’re building.',
    contactIntro: 'Have questions or want to chat?',
    phone: '+251 937 927441',
    email: 'hello@leseb.com',
    privacyHref: '/privacy',
    newsletterLine1: 'Subscribe to',
    newsletterLine2: 'our newsletter',
    newsletterBannerSrc: '/Leseb-logo.png',
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
  aboutEditorial: {
    heroEyebrow: 'About',
    heroLine1: 'We build technology',
    heroAccent: 'for humans.',
    letterSidebarLabel: 'A letter',
    letterSidebarMeta: 'From the founders\nAddis Ababa, 2026',
    letterOpening:
      '[[Leseb]] (ለሰብ) means "for humans" in Ge\'ez. It is the oldest word we could find for the newest thing we are trying to do.',
    letterBody:
      'We founded Leseb Tech Lab because the industry told us to move fast and break things. We watched what got broken: attention, trust, the quiet hours of the day. So we slowed down. We started a lab, not a factory, to study how software could feel like a friend instead of a feed.\n\nThe work ahead is wide. AI is rewriting the contract between people and machines. We intend to write our share of that contract carefully, in a language a person can read.\n\nAt Leseb, we believe [[social change is not optional; it is necessary]]. Technology is one of the few levers large enough to move it. We plan to pull, gently, with both hands.',
    letterSignOff: 'The Leseb Founders · ለሰብ · For humans',
    principlesHeading: 'Four principles.',
    principlesSubheading: 'The work, codified',
    principles: [
      {
        id: 'principle-1',
        visible: true,
        numeral: 'I.',
        title: 'People before platforms',
        body: 'Every decision passes through one filter: does this serve the human in front of the screen, or only the system behind it?',
      },
      {
        id: 'principle-2',
        visible: true,
        numeral: 'II.',
        title: 'AI with restraint',
        body: 'We use intelligence where it removes friction, not where it manufactures dependence. The model is a tool, never the destination.',
      },
      {
        id: 'principle-3',
        visible: true,
        numeral: 'III.',
        title: 'Built in the open',
        body: 'We document our reasoning, share our trade-offs, and invite scrutiny. Trust is earned by being legible.',
      },
      {
        id: 'principle-4',
        visible: true,
        numeral: 'IV.',
        title: 'Social change as a brief',
        body: 'Profit is a byproduct. The brief is impact, measured in lives made calmer, work made lighter, voices made heard.',
      },
    ],
    foundersEyebrow: 'Founders',
    foundersTitle: 'A lab in Addis Ababa',
    foundersParagraphs: [
      'Leseb Tech Lab is a small, intentional team. We work shoulder-to-shoulder with communities and partners, not as vendors, but as co-authors of the tools people rely on every day.',
      'Names and faces belong in conversation, not in a carousel. If you are building something humane and need a thoughtful technical partner, we would love to hear from you.',
    ],
    ctaEyebrow: 'Continue',
    ctaHeadingBefore: "See what we're",
    ctaHeadingAccent: 'building.',
    ctaButtonLabel: 'Back to the lab',
    ctaHref: '/',
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
    heroEyebrow: 'Contact',
    heroLine1: "Let's build",
    heroLine2: 'something ',
    heroAccent: 'for humans.',
    heroDescription:
      'Tell us about your product, partnership, or research question. We reply from Addis Ababa, usually within a few working days.',
    sectionKicker: 'Enquiries',
    sectionTitle: 'Get in touch.',
    introLine1:
      'Tell us what you are building, who it is for, and your timeline. We read every message and respond with next steps.',
    introLine2: 'Prefer email?',
    email: 'hello@leseb.com',
    phone: '+251 937 927441',
    formVisible: true,
    formSubmitLabel: 'Send Message',
    messagePlaceholder: 'Tell us about your project:',
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
    markSrc: '/Leseb-logo.png',
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
      visible: item.visible !== false,
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

type LegacySiteInsightTocSettings = SiteInsightTocSettings & {
  markDarkSrc?: unknown
  markLightSrc?: unknown
}

function resolveInsightTocMarkSrc(value: LegacySiteInsightTocSettings, def: SiteInsightTocSettings): string {
  const direct = typeof value.markSrc === 'string' ? value.markSrc.trim() : ''
  if (direct) return normalizeFooterLogoSrc(direct, def.markSrc)
  const dark = typeof value.markDarkSrc === 'string' ? value.markDarkSrc.trim() : ''
  if (dark) return normalizeFooterLogoSrc(dark, def.markSrc)
  const light = typeof value.markLightSrc === 'string' ? value.markLightSrc.trim() : ''
  if (light) return normalizeFooterLogoSrc(light, def.markSrc)
  return def.markSrc
}

function normalizeInsightTocSettings(value: LegacySiteInsightTocSettings): SiteInsightTocSettings {
  const def = DEFAULT_SITE_SETTINGS.insightToc
  return {
    markSrc: resolveInsightTocMarkSrc(value, def),
    markAlt: (typeof value.markAlt === 'string' ? value.markAlt.trim() : '') || def.markAlt,
  }
}

export function buildInsightTocSettingsForSave(value: SiteInsightTocSettings): SiteInsightTocSettings {
  return normalizeInsightTocSettings(value)
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

function nonEmptyString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function normalizeStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return [...fallback]
  const rows = value
    .map((row) => (typeof row === 'string' ? row.trim() : ''))
    .filter(Boolean)
  return rows.length ? rows : [...fallback]
}

function normalizeAboutEditorialPrinciples(
  value: unknown,
  fallback: AboutEditorialPrinciple[],
): AboutEditorialPrinciple[] {
  if (!Array.isArray(value)) return [...fallback]
  const rows = value
    .map((row, index) => {
      if (!isPlainObject(row)) return null
      const fb = fallback[index] ?? fallback[fallback.length - 1]!
      return {
        id: nonEmptyString(row.id, fb?.id ?? `principle-${index + 1}`),
        visible: row.visible !== false,
        numeral: nonEmptyString(row.numeral, fb?.numeral ?? `${index + 1}.`),
        title: nonEmptyString(row.title, fb?.title ?? 'Principle'),
        body: nonEmptyString(row.body, fb?.body ?? ''),
      }
    })
    .filter((row): row is AboutEditorialPrinciple => Boolean(row))
  return rows.length ? rows : [...fallback]
}

/** Split letter body into paragraphs (blank line between blocks). */
export function splitAboutLetterBody(body: string): string[] {
  return body
    .replace(/\r\n/g, '\n')
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n+/g, ' ').trim())
    .filter(Boolean)
}

function normalizeAboutLetterBodyText(body: string, fallback: string): string {
  const trimmed = body.replace(/\r\n/g, '\n').trim()
  return trimmed || fallback
}

type LegacyAboutLetterFields = {
  letterMetaLine1?: unknown
  letterMetaLine2?: unknown
  letterHighlightWord?: unknown
  letterTransliteration?: unknown
  letterQuotedPhrase?: unknown
  letterLeadSuffix?: unknown
  letterParagraphs?: unknown
  letterSignature?: unknown
  letterSignatureTagline?: unknown
}

function resolveAboutLetterSidebarMeta(
  value: AboutEditorialContentSettings & LegacyAboutLetterFields,
  def: AboutEditorialContentSettings,
): string {
  const direct = typeof value.letterSidebarMeta === 'string' ? value.letterSidebarMeta.trim() : ''
  if (direct) return direct
  const line1 = typeof value.letterMetaLine1 === 'string' ? value.letterMetaLine1.trim() : ''
  const line2 = typeof value.letterMetaLine2 === 'string' ? value.letterMetaLine2.trim() : ''
  const legacy = [line1, line2].filter(Boolean).join('\n')
  return legacy || def.letterSidebarMeta
}

function resolveAboutLetterOpening(
  value: AboutEditorialContentSettings & LegacyAboutLetterFields,
  def: AboutEditorialContentSettings,
): string {
  const direct = typeof value.letterOpening === 'string' ? value.letterOpening.trim() : ''
  if (direct) return direct
  const word = typeof value.letterHighlightWord === 'string' ? value.letterHighlightWord.trim() : ''
  if (!word) return def.letterOpening
  const transliteration =
    typeof value.letterTransliteration === 'string' ? value.letterTransliteration.trim() : ''
  const phrase = typeof value.letterQuotedPhrase === 'string' ? value.letterQuotedPhrase.trim() : ''
  const suffix = typeof value.letterLeadSuffix === 'string' ? value.letterLeadSuffix.trim() : ''
  const opening = `[[${word}]]${transliteration ? ` (${transliteration})` : ''}${
    phrase ? ` means "${phrase}"` : ''
  }${suffix ? ` ${suffix}` : ''}`.trim()
  return opening || def.letterOpening
}

function resolveAboutLetterBody(
  value: AboutEditorialContentSettings & LegacyAboutLetterFields,
  def: AboutEditorialContentSettings,
): string {
  const direct = typeof value.letterBody === 'string' ? value.letterBody.trim() : ''
  if (direct) return direct
  if (Array.isArray(value.letterParagraphs)) {
    const paragraphs = value.letterParagraphs
      .map((row) => (typeof row === 'string' ? row.trim() : ''))
      .filter(Boolean)
    if (paragraphs.length) return paragraphs.join('\n\n')
  }
  return def.letterBody
}

function resolveAboutLetterSignOff(
  value: AboutEditorialContentSettings & LegacyAboutLetterFields,
  def: AboutEditorialContentSettings,
): string {
  const direct = typeof value.letterSignOff === 'string' ? value.letterSignOff.trim() : ''
  if (direct) return direct
  const signature = typeof value.letterSignature === 'string' ? value.letterSignature.trim() : ''
  const tagline =
    typeof value.letterSignatureTagline === 'string' ? value.letterSignatureTagline.trim() : ''
  const legacy = [signature, tagline].filter(Boolean).join(' · ')
  return legacy || def.letterSignOff
}

function normalizeAboutEditorialSettings(
  value: AboutEditorialContentSettings & LegacyAboutLetterFields,
): AboutEditorialContentSettings {
  const def = DEFAULT_SITE_SETTINGS.aboutEditorial
  return {
    heroEyebrow: nonEmptyString(value.heroEyebrow, def.heroEyebrow),
    heroLine1: nonEmptyString(value.heroLine1, def.heroLine1),
    heroAccent: nonEmptyString(value.heroAccent, def.heroAccent),
    letterSidebarLabel: nonEmptyString(value.letterSidebarLabel, def.letterSidebarLabel),
    letterSidebarMeta: resolveAboutLetterSidebarMeta(value, def),
    letterOpening: normalizeAboutLetterBodyText(resolveAboutLetterOpening(value, def), def.letterOpening),
    letterBody: normalizeAboutLetterBodyText(resolveAboutLetterBody(value, def), def.letterBody),
    letterSignOff: resolveAboutLetterSignOff(value, def),
    principlesHeading: nonEmptyString(value.principlesHeading, def.principlesHeading),
    principlesSubheading: nonEmptyString(value.principlesSubheading, def.principlesSubheading),
    principles: normalizeAboutEditorialPrinciples(value.principles, def.principles),
    foundersEyebrow: nonEmptyString(value.foundersEyebrow, def.foundersEyebrow),
    foundersTitle: nonEmptyString(value.foundersTitle, def.foundersTitle),
    foundersParagraphs: normalizeStringList(value.foundersParagraphs, def.foundersParagraphs),
    ctaEyebrow: nonEmptyString(value.ctaEyebrow, def.ctaEyebrow),
    ctaHeadingBefore: nonEmptyString(value.ctaHeadingBefore, def.ctaHeadingBefore),
    ctaHeadingAccent: nonEmptyString(value.ctaHeadingAccent, def.ctaHeadingAccent),
    ctaButtonLabel: nonEmptyString(value.ctaButtonLabel, def.ctaButtonLabel),
    ctaHref: nonEmptyString(value.ctaHref, def.ctaHref),
  }
}

function normalizeContactFormFields(
  saved: ContactFormField[],
  messagePlaceholder: string,
): ContactFormField[] {
  const defaults = DEFAULT_SITE_SETTINGS.contact.formFields
  const byName = new Map(saved.map((field) => [field.name, field]))

  return defaults.map((field) => {
    const row = byName.get(field.name)
    const placeholder =
      field.name === 'project'
        ? nonEmptyString(messagePlaceholder, field.placeholder ?? '')
        : typeof row?.placeholder === 'string'
          ? row.placeholder
          : field.placeholder

    if (!row) {
      return { ...field, placeholder }
    }

    return {
      ...field,
      id: nonEmptyString(row.id, field.id),
      visible: row.visible !== false,
      label: nonEmptyString(row.label, field.label),
      kind: field.kind,
      placeholder,
      required:
        field.name === 'phone' || field.name === 'city' ? row.required === true : row.required !== false,
    }
  })
}

function normalizeContactSocialLinks(saved: ContactSocialLink[]): ContactSocialLink[] {
  const order: ContactSocialIconId[] = ['instagram', 'tiktok', 'linkedin', 'telegram', 'youtube']
  const defaults = new Map(
    DEFAULT_SITE_SETTINGS.contact.socialLinks.map((link) => [link.iconId, link]),
  )
  const byIcon = new Map(saved.map((link) => [link.iconId, link]))

  return order.map((iconId) => {
    const def = defaults.get(iconId)!
    const row = byIcon.get(iconId)
    if (!row) return def
    return {
      id: nonEmptyString(row.id, def.id),
      visible: row.visible !== false,
      label: nonEmptyString(row.label, def.label),
      href: typeof row.href === 'string' ? row.href.trim() : def.href,
      iconId,
    }
  })
}

export function normalizeContactSettings(
  value: ContactPageSettings,
  footerPhoneFallback = '',
): ContactPageSettings {
  const def = DEFAULT_SITE_SETTINGS.contact
  const savedFields = Array.isArray(value.formFields) ? value.formFields : def.formFields
  const projectField = savedFields.find((field) => field.name === 'project')
  const messagePlaceholder = nonEmptyString(
    value.messagePlaceholder,
    typeof projectField?.placeholder === 'string' ? projectField.placeholder : def.messagePlaceholder,
  )
  const phone = nonEmptyString(value.phone, footerPhoneFallback.trim() || def.phone)

  return {
    metaTitle: nonEmptyString(value.metaTitle, def.metaTitle),
    metaDescription: nonEmptyString(value.metaDescription, def.metaDescription),
    heroEyebrow: nonEmptyString(value.heroEyebrow, def.heroEyebrow),
    heroLine1: nonEmptyString(value.heroLine1, def.heroLine1),
    heroLine2: nonEmptyString(value.heroLine2, def.heroLine2),
    heroAccent: nonEmptyString(value.heroAccent, def.heroAccent),
    heroDescription: nonEmptyString(value.heroDescription, def.heroDescription),
    sectionKicker: nonEmptyString(value.sectionKicker, def.sectionKicker),
    sectionTitle: nonEmptyString(value.sectionTitle, def.sectionTitle),
    introLine1: nonEmptyString(value.introLine1, def.introLine1),
    introLine2: nonEmptyString(value.introLine2, def.introLine2),
    email: nonEmptyString(value.email, def.email),
    phone,
    formSubmitLabel: nonEmptyString(value.formSubmitLabel, def.formSubmitLabel),
    messagePlaceholder,
    newsletterOptInVisible: value.newsletterOptInVisible !== false,
    newsletterOptInLabel: nonEmptyString(value.newsletterOptInLabel, def.newsletterOptInLabel),
    socialVisible: value.socialVisible !== false,
    socialLinks: normalizeContactSocialLinks(
      Array.isArray(value.socialLinks) ? value.socialLinks : def.socialLinks,
    ),
    formVisible: true,
    privacyPolicyHref: '/privacy',
    formFields: normalizeContactFormFields(savedFields, messagePlaceholder),
  }
}

/** Apply contact admin edits before persisting site settings. */
export function buildContactSettingsForSave(
  value: ContactPageSettings,
  footerPhoneFallback = '',
): ContactPageSettings {
  return normalizeContactSettings(value, footerPhoneFallback)
}

type LegacySiteHeroSettings = SiteHeroSettings & {
  tagline?: unknown
  backdropLightSrc?: unknown
  backdropDarkSrc?: unknown
}

function resolveHeroTitleAccent(value: LegacySiteHeroSettings, def: SiteHeroSettings): string {
  const direct = typeof value.titleAccent === 'string' ? value.titleAccent.trim() : ''
  if (direct) return direct
  const line2 = typeof value.nameLine2 === 'string' ? value.nameLine2.trim() : ''
  if (line2 === 'built for humans.' || line2.endsWith('for humans.')) return 'for humans.'
  return def.titleAccent
}

function resolveHeroNameLine2(value: LegacySiteHeroSettings, def: SiteHeroSettings): string {
  const direct = typeof value.nameLine2 === 'string' ? value.nameLine2.trim() : ''
  if (!direct) return def.nameLine2
  if (direct === 'built for humans.') return 'built '
  if (direct.endsWith('for humans.') && !value.titleAccent) return direct.replace(/\s*for humans\.?\s*$/i, ' ').trimEnd() + ' '
  return direct
}

export function normalizeSiteHeroSettings(value: LegacySiteHeroSettings): SiteHeroSettings {
  const def = DEFAULT_SITE_SETTINGS.hero
  const whoAmIEyebrowRaw = nonEmptyString(value.whoAmIEyebrow, def.whoAmIEyebrow)
  const whoAmIEyebrow =
    whoAmIEyebrowRaw === LEGACY_WHO_AM_I_EYEBROW ? def.whoAmIEyebrow : whoAmIEyebrowRaw

  let whoAmIBody = nonEmptyString(value.whoAmIBody, def.whoAmIBody)
  if (whoAmIBody === LEGACY_HERO_WHO_AMI_BODY) whoAmIBody = def.whoAmIBody

  let nameLine1 = nonEmptyString(value.nameLine1, def.nameLine1)
  let nameLine2 = resolveHeroNameLine2(value, def)
  const titleAccent = resolveHeroTitleAccent(value, def)

  if (nameLine1 === LEGACY_HERO_NAME_LINE_1 && value.nameLine2 === LEGACY_HERO_NAME_LINE_2) {
    nameLine1 = def.nameLine1
    nameLine2 = def.nameLine2
  }

  let roleLine1 = nonEmptyString(value.roleLine1, def.roleLine1)
  let roleLine2 = nonEmptyString(value.roleLine2, def.roleLine2)
  if (roleLine1 === 'Architect' && roleLine2 === 'Creative Director') {
    roleLine1 = def.roleLine1
    roleLine2 = def.roleLine2
  }

  return {
    eyebrow: nonEmptyString(value.eyebrow, def.eyebrow),
    nameLine1,
    nameLine2,
    titleAccent,
    whoAmIEyebrow,
    whoAmIBody,
    whoAmIButtonLabel: nonEmptyString(value.whoAmIButtonLabel, def.whoAmIButtonLabel),
    whoAmIButtonHref: nonEmptyString(value.whoAmIButtonHref, def.whoAmIButtonHref),
    roleLine1,
    roleLine2,
  }
}

export function buildSiteHeroSettingsForSave(value: SiteHeroSettings): SiteHeroSettings {
  return normalizeSiteHeroSettings(value)
}

type LegacySiteFooterSettings = SiteFooterSettings & {
  headline?: unknown
  contactTitle?: unknown
  socialHandle?: unknown
  tagline?: unknown
  creditPrefix?: unknown
  creditName?: unknown
  creditHref?: unknown
  logoLightSrc?: unknown
  logoDarkSrc?: unknown
}

function resolveNewsletterBannerSrc(value: LegacySiteFooterSettings, def: SiteFooterSettings): string {
  const direct = typeof value.newsletterBannerSrc === 'string' ? value.newsletterBannerSrc.trim() : ''
  if (direct) return normalizeFooterLogoSrc(direct, def.newsletterBannerSrc)
  const light = typeof value.logoLightSrc === 'string' ? value.logoLightSrc.trim() : ''
  if (light) return normalizeFooterLogoSrc(light, def.newsletterBannerSrc)
  const dark = typeof value.logoDarkSrc === 'string' ? value.logoDarkSrc.trim() : ''
  if (dark) return normalizeFooterLogoSrc(dark, def.newsletterBannerSrc)
  return def.newsletterBannerSrc
}

export function normalizeSiteFooterSettings(value: LegacySiteFooterSettings): SiteFooterSettings {
  const def = DEFAULT_SITE_SETTINGS.footer
  const contactIntroRaw =
    typeof value.contactIntro === 'string' && value.contactIntro.trim()
      ? value.contactIntro.trim()
      : typeof value.contactTitle === 'string' && value.contactTitle.trim()
        ? value.contactTitle.trim()
        : def.contactIntro

  return {
    workPanelLine1: nonEmptyString(value.workPanelLine1, def.workPanelLine1),
    workPanelLine2: nonEmptyString(value.workPanelLine2, def.workPanelLine2),
    workPanelDescription: nonEmptyString(value.workPanelDescription, def.workPanelDescription),
    aboutPanelLine1: nonEmptyString(value.aboutPanelLine1, def.aboutPanelLine1),
    aboutPanelLine2: nonEmptyString(value.aboutPanelLine2, def.aboutPanelLine2),
    aboutPanelDescription: nonEmptyString(value.aboutPanelDescription, def.aboutPanelDescription),
    contactIntro: contactIntroRaw,
    email: nonEmptyString(value.email, def.email),
    phone: typeof value.phone === 'string' ? value.phone.trim() : def.phone,
    privacyHref: nonEmptyString(value.privacyHref, def.privacyHref),
    socialLinks: normalizeFooterSocialLinks(value.socialLinks ?? []),
    newsletterLine1: nonEmptyString(value.newsletterLine1, def.newsletterLine1),
    newsletterLine2: nonEmptyString(value.newsletterLine2, def.newsletterLine2),
    newsletterBannerSrc: resolveNewsletterBannerSrc(value, def),
  }
}

export function buildSiteFooterSettingsForSave(value: SiteFooterSettings): SiteFooterSettings {
  return normalizeSiteFooterSettings(value)
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
  const newsletterLogoDefault = DEFAULT_SITE_SETTINGS.footer.newsletterBannerSrc
  const rawFooter = isPlainObject(raw.footer) ? (raw.footer as LegacySiteFooterSettings) : null
  if (rawFooter) {
    const light = typeof rawFooter.logoLightSrc === 'string' ? rawFooter.logoLightSrc : ''
    const dark = typeof rawFooter.logoDarkSrc === 'string' ? rawFooter.logoDarkSrc : ''
    if (
      light === LEGACY_NEWSLETTER_SPLASH_LIGHT ||
      light === LEGACY_FOOTER_LOGO ||
      dark === LEGACY_NEWSLETTER_SPLASH_DARK ||
      dark === LEGACY_FOOTER_LOGO
    ) {
      next = {
        ...next,
        footer: { ...next.footer, newsletterBannerSrc: newsletterLogoDefault },
      }
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
    hero: normalizeSiteHeroSettings(next.hero),
    aboutEditorial: normalizeAboutEditorialSettings(next.aboutEditorial),
    aboutJourney: {
      ...next.aboutJourney,
      toolkitSections,
    },
    dualMarquee: normalizeDualMarqueeSettings(next.dualMarquee),
    privacy: normalizePrivacySettings(next.privacy),
    insightToc: normalizeInsightTocSettings(next.insightToc),
    footer: normalizeSiteFooterSettings(next.footer),
    portfolioCatalogFilters: isLegacyArchitectureCatalogFilters(next.portfolioCatalogFilters.workInsights)
      ? getDefaultPortfolioCatalogFilters()
      : normalizePortfolioCatalogFiltersState(next.portfolioCatalogFilters),
    contact: normalizeContactSettings(next.contact, next.footer.phone),
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

