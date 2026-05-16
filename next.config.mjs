import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo-style lockfiles one level up confuse file tracing; pin the app root.
  outputFileTracingRoot: projectRoot,
  // Keep Prisma + query engine out of per-route bundles (fixes dev "engine not found" on /insights/[slug]).
  serverExternalPackages: ['@prisma/client', 'prisma', '@prisma/engines'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'react-icons'],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/adminopia',
        permanent: true,
      },
      {
        source: '/admin/:path*',
        destination: '/adminopia/:path*',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/adminopia/overview',
        permanent: false,
      },
      {
        source: '/admin/dashboard',
        destination: '/adminopia/overview',
        permanent: false,
      },
      {
        source: '/admin/work/new',
        destination: '/adminopia/work/create',
        permanent: true,
      },
      {
        source: '/admin/insights/new',
        destination: '/adminopia/insights/create',
        permanent: true,
      },
    ]
  },
  async headers() {
    const ogNoStore = [
      { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
    ]
    return [
      { source: '/opengraph-image', headers: ogNoStore },
      { source: '/twitter-image', headers: ogNoStore },
      { source: '/work/:slug/opengraph-image', headers: ogNoStore },
      { source: '/insights/:slug/opengraph-image', headers: ogNoStore },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/adminopia',
        destination: '/admin',
      },
      {
        source: '/adminopia/:path*',
        destination: '/admin/:path*',
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1536, 1920, 2560, 3200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
