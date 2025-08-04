/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['s3-alpha.figma.com', 'www.figma.com'],
  },
  experimental: {
    // Enable experimental features if needed
  },
  webpack: (config, { isServer }) => {
    // Custom webpack configuration if needed
    return config;
  },
}

module.exports = nextConfig
