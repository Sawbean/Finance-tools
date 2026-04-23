/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 1. UPDATED IMAGES SECTION (Using remotePatterns for security & quality)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',   // FOR PREMIUM PHOTOS
        pathname: '/**',
      },
    ],
  },

  // 2. PRESERVED YOUR EXISTING REWRITES
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
};

module.exports = nextConfig;