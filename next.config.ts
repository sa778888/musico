/** @type {import('next').NextConfig} */
const nextConfig = {eslint: {
    // Warning: This allows production builds to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'is1-ssl.mzstatic.com',
        port: '',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: 'lastfm.freetls.fastly.net',
        pathname: '/**',
      },{
        protocol: 'https',
        hostname: 'www.theaudiodb.com',
      },
    ],
    domains: [
      'i.ytimg.com',
      'is1-ssl.mzstatic.com',
      'is2-ssl.mzstatic.com',
      'is3-ssl.mzstatic.com',
      'is4-ssl.mzstatic.com',
      'is5-ssl.mzstatic.com',
        'lastfm.freetls.fastly.net',
      'via.placeholder.com'
    ],
  },
};

module.exports = nextConfig;
