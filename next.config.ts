import type { NextConfig } from 'next'

// No third-party scripts yet. Analytics, Turnstile and video embeds are added here when approved.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ')

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // The business enquiry pages were removed on 31 Oct 2026.
      { source: '/partners/:path*', destination: '/contact', permanent: true },
      { source: '/partners', destination: '/contact', permanent: true },
      // The science page was removed on 31 Oct 2026.
      { source: '/science', destination: '/', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Browsers only honour this over HTTPS; it keeps returning visitors on HTTPS.
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
      // Production only: the dev server needs eval for hot reloading.
      ...(process.env.NODE_ENV === 'production'
        ? [{ source: '/((?!_next).*)', headers: [{ key: 'Content-Security-Policy', value: contentSecurityPolicy }] }]
        : []),
    ]
  },
  poweredByHeader: false,
  // Self-contained server bundle for the Docker image.
  output: 'standalone',
  // The bundler misses sharp's native libvips libraries (DLL/.so files); include them explicitly.
  outputFileTracingIncludes: { '/**': ['./node_modules/@img/**/*'] },
}

export default nextConfig
