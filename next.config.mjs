/** @type {import('next').NextConfig} */
const nextConfig = {
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
