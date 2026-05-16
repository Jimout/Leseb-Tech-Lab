import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { InsightDetailFromStorage } from '@/components/insight-detail-from-storage'
import { FooterSection } from '@/components/footer-section'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { JsonLd } from '@/components/seo/json-ld'
import { SiteNavbar } from '@/components/site-navbar'
import { Toaster } from '@/components/ui/toaster'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { articleJsonLd } from '@/lib/seo/schema'
import { canonicalInsightSlugForRequestSlug, getAllInsightSlugs, getInsightDetailBySlug } from '@/lib/insight-detail-data'
import { resolveInsightPageBySlug } from '@/lib/insight-detail-slug-resolution'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllInsightSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const canonical = await canonicalInsightSlugForRequestSlug(slug)
  const detail = await getInsightDetailBySlug(canonical)
  const ogImage = `/insights/${canonical}/opengraph-image`
  if (!detail) {
    return buildPageMetadata({
      title: 'Insight',
      description: 'Insight article from Leseb Tech Lab.',
      path: `/insights/${canonical}`,
      ogImage,
    })
  }
  const description = detail.description.length > 155 ? `${detail.description.slice(0, 152)}…` : detail.description
  const published = `${detail.dateIso}T12:00:00.000Z`
  return buildPageMetadata({
    title: detail.title,
    description,
    path: `/insights/${canonical}`,
    ogImage,
    ogType: 'article',
    article: {
      publishedTime: published,
      section: 'Insights',
      tags: [...detail.filterIds],
    },
  })
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params
  const detail = await resolveInsightPageBySlug(slug)
  if (!detail) notFound()

  const published = `${detail.dateIso}T12:00:00.000Z`
  const canon = detail.slug ?? slug

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
          { name: detail.title, path: `/insights/${canon}` },
        ]}
      />
      <JsonLd
        data={articleJsonLd({
          headline: detail.title,
          description: detail.description,
          path: `/insights/${canon}`,
          datePublished: published,
          imageUrl: detail.heroMedia?.url ?? undefined,
        })}
      />
      <SiteNavbar logoHref="/" />
      <main className="min-h-dvh scroll-mt-24 bg-background text-foreground">
        <InsightDetailFromStorage slug={canon} serverDetail={detail} />
        <FooterSection />
        <Toaster />
      </main>
    </>
  )
}
