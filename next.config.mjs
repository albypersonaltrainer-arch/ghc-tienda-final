/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'beverly.es',
        pathname: '/cdn/shop/files/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'ghcnutrition.com',
          },
        ],
        destination: 'https://www.ghcnutrition.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
