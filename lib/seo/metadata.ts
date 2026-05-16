import type { Metadata } from 'next'

import { SITE_BRAND_FULL_NAME } from '@/lib/site-brand'

import { absoluteUrl, getSiteUrl, siteSeoConfig } from './site-config'

const defaultOgImagePath = '/opengraph-image'

export const rootAuthorMetadata: Metadata['authors'] = [
  { name: siteSeoConfig.personName, url: getSiteUrl() },
]

/**
 * Default Open Graph / Twitter inherited by all pages (overridable per route).
 */
export function buildDefaultOpenGraph(): NonNullable<Metadata['openGraph']> {
  const url = getSiteUrl()
  return {
    type: 'website',
    locale: siteSeoConfig.locale,
    url,
    siteName: SITE_BRAND_FULL_NAME,
    title: siteSeoConfig.ogTitle,
    description: siteSeoConfig.defaultDescription,
    images: [
      {
        url: defaultOgImagePath,
        width: 1200,
        height: 630,
        alt: SITE_BRAND_FULL_NAME,
      },
    ],
  }
}

export function buildDefaultTwitter(): NonNullable<Metadata['twitter']> {
  return {
    card: 'summary_large_image',
    title: siteSeoConfig.ogTitle,
    description: siteSeoConfig.defaultDescription,
    site: SITE_BRAND_FULL_NAME,
    creator: siteSeoConfig.twitterHandle,
    images: [defaultOgImagePath],
  }
}

export type PageSeoInput = {
  /** Shown in tab; merged with root template unless absoluteTitle is set */
  title: string
  description: string
  /** Path only, e.g. /work/my-project */
  path: string
  /** Relative image path or absolute URL for OG/Twitter */
  ogImage?: string
  ogType?: 'website' | 'article'
  article?: {
    publishedTime?: string
    modifiedTime?: string
    authors?: string[]
    section?: string
    tags?: string[]
  }
  /** If true, title is not passed through %s — template */
  absoluteTitle?: boolean
}

/**
 * Production-grade per-page metadata: canonical, OG, Twitter, keywords, robots (indexable).
 */
export function buildPageMetadata(input: PageSeoInput): Metadata {
  const canonical = absoluteUrl(input.path)
  const imageUrl =
    input.ogImage?.startsWith('http://') || input.ogImage?.startsWith('https://')
      ? input.ogImage
      : absoluteUrl(input.ogImage ?? defaultOgImagePath)

  const titleMeta: Metadata['title'] = input.absoluteTitle
    ? { absolute: input.title }
    : input.title

  const og: NonNullable<Metadata['openGraph']> = {
    type: input.ogType ?? 'website',
    url: canonical,
    title: input.title,
    description: input.description,
    siteName: SITE_BRAND_FULL_NAME,
    locale: siteSeoConfig.locale,
    images: [{ url: imageUrl, width: 1200, height: 630, alt: input.title }],
  }

  if (input.ogType === 'article' && input.article) {
    if (input.article.publishedTime) og.publishedTime = input.article.publishedTime
    if (input.article.modifiedTime) og.modifiedTime = input.article.modifiedTime
    if (input.article.authors?.length) {
      og.authors = input.article.authors.map((name) => ({ name, url: getSiteUrl() }))
    }
    if (input.article.section) og.section = input.article.section
    if (input.article.tags?.length) og.tags = input.article.tags
  }

  return {
    title: titleMeta,
    description: input.description,
    keywords: [...siteSeoConfig.keywords],
    authors: rootAuthorMetadata,
    alternates: { canonical },
    openGraph: og,
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      site: SITE_BRAND_FULL_NAME,
      creator: siteSeoConfig.twitterHandle,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  }
}
