import type { Metadata, Viewport } from 'next'
import { DeferredAnalytics } from '@/components/deferred-analytics'
import { GlobalJsonLd } from '@/components/seo/global-json-ld'
import { AuthSessionProvider } from '@/components/providers/auth-session-provider'
import { SiteSettingsProvider } from '@/components/providers/site-settings-provider'
import { VisitTracker } from '@/components/visit-tracker'
import { WebVitalsReporter } from '@/components/web-vitals-reporter'
import './globals.css'
import { buildDefaultOpenGraph, buildDefaultTwitter, rootAuthorMetadata } from '@/lib/seo/metadata'
import { getSiteUrl, siteSeoConfig } from '@/lib/seo/site-config'
import { SITE_BRAND_NAME } from '@/lib/site-brand'
import { getSiteSettingsFromDb } from '@/lib/site-settings-db'


export const viewport: Viewport = {
  themeColor: '#1f1d1b',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_BRAND_NAME,
    template: `%s | ${SITE_BRAND_NAME}`,
  },
  description: siteSeoConfig.defaultDescription,
  keywords: [...siteSeoConfig.keywords],
  authors: rootAuthorMetadata,
  creator: siteSeoConfig.personName,
  publisher: siteSeoConfig.personName,
  applicationName: SITE_BRAND_NAME,
  category: 'design',
  icons: null,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: buildDefaultOpenGraph(),
  twitter: buildDefaultTwitter(),
  appleWebApp: {
    capable: true,
    title: SITE_BRAND_NAME,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialSiteSettings = await getSiteSettingsFromDb()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="2xl:px-[160px] 3xl:px-[200px] 4xl:px-[240px] font-sans antialiased"
      >
        <GlobalJsonLd />
        <AuthSessionProvider>
          <SiteSettingsProvider initialSettings={initialSiteSettings}>
            {children}
            <VisitTracker />
            <WebVitalsReporter />
          </SiteSettingsProvider>
        </AuthSessionProvider>
        <DeferredAnalytics />
      </body>
    </html>
  )
}
