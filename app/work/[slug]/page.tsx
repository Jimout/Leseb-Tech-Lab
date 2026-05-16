import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { WorkDetailFromStorage } from '@/components/work-detail-from-storage'
import { FooterSection } from '@/components/footer-section'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { JsonLd } from '@/components/seo/json-ld'
import { SiteNavbar } from '@/components/site-navbar'
import { Toaster } from '@/components/ui/toaster'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { creativeWorkJsonLd } from '@/lib/seo/schema'
import { resolveWorkPageBySlug } from '@/lib/work-detail-slug-resolution'
import { canonicalWorkSlugForRequestSlug, getAllWorkSlugs, getWorkDetailBySlug } from '@/lib/work-detail-data'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllWorkSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const canonical = await canonicalWorkSlugForRequestSlug(slug)
  const detail = await getWorkDetailBySlug(canonical)
  const ogImage = `/work/${canonical}/opengraph-image`
  if (!detail) {
    return buildPageMetadata({
      title: 'Work',
      description: 'Software and product project from Leseb Tech Lab.',
      path: `/work/${canonical}`,
      ogImage,
    })
  }
  const descSource = detail.descriptionNote?.trim() || detail.body?.trim() || detail.work.title
  const desc = descSource.length > 155 ? `${descSource.slice(0, 152)}…` : descSource
  return buildPageMetadata({
    title: detail.pageTitle,
    description: desc,
    path: `/work/${canonical}`,
    ogImage,
  })
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params
  const detail = await resolveWorkPageBySlug(slug)
  if (!detail) notFound()
  const canon = detail.work.slug ?? slug
  const descForSchema =
    detail.descriptionNote?.trim() ||
    detail.body?.trim() ||
    detail.work.title ||
    'Software and product project from Leseb Tech Lab.'

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
          { name: detail.pageTitle, path: `/work/${canon}` },
        ]}
      />
      <JsonLd
        data={creativeWorkJsonLd({
          name: detail.pageTitle,
          description: descForSchema.slice(0, 500),
          path: `/work/${canon}`,
          imageUrl: detail.work.heroMedia?.url ?? undefined,
          keywords: detail.tags,
        })}
      />
      <SiteNavbar logoHref="/" />
      <main className="min-h-dvh scroll-mt-24 bg-background text-foreground">
        <WorkDetailFromStorage key={canon} slug={canon} serverDetail={detail} />
        <FooterSection />
        <Toaster />
      </main>
    </>
  )
}
