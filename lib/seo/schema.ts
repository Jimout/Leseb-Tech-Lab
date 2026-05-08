import { SITE_BRAND_NAME } from '@/lib/site-brand'

import { absoluteUrl, getSiteUrl, siteSeoConfig } from './site-config'

export type BreadcrumbItem = { name: string; path: string }

/** https://schema.org/Person */
export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteSeoConfig.personName,
    alternateName: siteSeoConfig.handle,
    jobTitle: siteSeoConfig.jobTitle,
    url: getSiteUrl(),
    sameAs: [...siteSeoConfig.sameAs],
  }
}

/** https://schema.org/WebSite */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_BRAND_NAME,
    url: getSiteUrl(),
    description: siteSeoConfig.defaultDescription,
    inLanguage: 'en',
    publisher: {
      '@type': 'Person',
      name: siteSeoConfig.personName,
      url: getSiteUrl(),
    },
  }
}

/** https://schema.org/BreadcrumbList */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/** https://schema.org/Article (insights) */
export function articleJsonLd(opts: {
  headline: string
  description: string
  path: string
  datePublished: string
  dateModified?: string
  imageUrl?: string
}) {
  const url = absoluteUrl(opts.path)
  const image =
    opts.imageUrl?.startsWith('http') ? opts.imageUrl : opts.imageUrl ? absoluteUrl(opts.imageUrl) : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: {
      '@type': 'Person',
      name: siteSeoConfig.personName,
      url: getSiteUrl(),
    },
    publisher: {
      '@type': 'Person',
      name: siteSeoConfig.personName,
      url: getSiteUrl(),
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(image ? { image: [image] } : {}),
  }
}

/** https://schema.org/CreativeWork (portfolio projects) */
export function creativeWorkJsonLd(opts: {
  name: string
  description: string
  path: string
  imageUrl?: string
  dateCreated?: string
  keywords?: string[]
}) {
  const url = absoluteUrl(opts.path)
  const image =
    opts.imageUrl?.startsWith('http') ? opts.imageUrl : opts.imageUrl ? absoluteUrl(opts.imageUrl) : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.name,
    description: opts.description,
    url,
    creator: {
      '@type': 'Person',
      name: siteSeoConfig.personName,
      url: getSiteUrl(),
    },
    ...(image ? { image } : {}),
    ...(opts.dateCreated ? { dateCreated: opts.dateCreated } : {}),
    ...(opts.keywords?.length ? { keywords: opts.keywords.join(', ') } : {}),
  }
}

/**
 * Single site-wide @graph: Person + WebSite + ProfessionalService with stable @id IRIs.
 * Injected from the root layout so every public HTML response includes global entity SEO.
 */
export function siteGraphJsonLd() {
  const base = getSiteUrl().replace(/\/$/, '')
  const personId = `${base}/#identity`
  const websiteId = `${base}/#website`
  const orgId = `${base}/#organization`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: siteSeoConfig.personName,
        alternateName: siteSeoConfig.handle,
        jobTitle: siteSeoConfig.jobTitle,
        url: base,
        sameAs: [...siteSeoConfig.sameAs],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: SITE_BRAND_NAME,
        url: base,
        description: siteSeoConfig.defaultDescription,
        inLanguage: 'en',
        publisher: { '@id': orgId },
        author: { '@id': personId },
      },
      {
        '@type': 'ProfessionalService',
        '@id': orgId,
        name: SITE_BRAND_NAME,
        alternateName: siteSeoConfig.handle,
        url: base,
        description: siteSeoConfig.defaultDescription,
        founder: { '@id': personId },
        areaServed: [
          { '@type': 'Country', name: 'Ethiopia' },
          { '@type': 'Place', name: 'Addis Ababa' },
        ],
      },
    ],
  }
}
