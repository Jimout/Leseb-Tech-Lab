import type { Metadata, Viewport } from 'next'
import { DeferredAnalytics } from '@/components/deferred-analytics'
import { GlobalJsonLd } from '@/components/seo/global-json-ld'
import { AdminAuthProvider } from '@/components/providers/admin-auth-provider'
import { SiteSettingsProvider } from '@/components/providers/site-settings-provider'
import './globals.css'
import { DEFAULT_SITE_SETTINGS } from '@/lib/admin/site-settings'
import { buildDefaultOpenGraph, buildDefaultTwitter, rootAuthorMetadata } from '@/lib/seo/metadata'
import { getSiteUrl, siteSeoConfig } from '@/lib/seo/site-config'
import { SITE_BRAND_FULL_NAME } from '@/lib/site-brand'


export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_BRAND_FULL_NAME,
    template: `%s | ${SITE_BRAND_FULL_NAME}`,
  },
  description: siteSeoConfig.defaultDescription,
  keywords: [...siteSeoConfig.keywords],
  authors: rootAuthorMetadata,
  creator: siteSeoConfig.personName,
  publisher: siteSeoConfig.personName,
  applicationName: SITE_BRAND_FULL_NAME,
  category: 'technology',
  icons: {
    icon: [{ url: '/Leseb-logo.png', type: 'image/png' }],
    shortcut: '/Leseb-logo.png',
    apple: [{ url: '/Leseb-logo.png', type: 'image/png' }],
  },
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
    title: SITE_BRAND_FULL_NAME,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans antialiased"
      >
        <GlobalJsonLd />
        <AdminAuthProvider>
          <SiteSettingsProvider initialSettings={DEFAULT_SITE_SETTINGS}>
            {children}
          </SiteSettingsProvider>
        </AdminAuthProvider>
        <DeferredAnalytics />
      </body>
    </html>
  )
}
