/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TypeScript errors for the build
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Add other domains as needed
    ],
    domains: [
      'res.cloudinary.com',
      'source.unsplash.com',
      'images.unsplash.com',
      'unsplash.com', // Optional, for legacy/compat
    ],
  },
};

export default nextConfig;
