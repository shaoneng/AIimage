import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'nextuipro.nyc3.cdn.digitaloceanspaces.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: "https",
            hostname: "replicate.com",
          },
          {
            protocol: "https",
            hostname: "replicate.delivery",
          },
        ],
      },
      video: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'replicate.delivery',
          },
          {
            protocol: 'https',
            hostname: 'replicate.com',
          },
        ],
      },
};
 
export default withNextIntl(nextConfig);