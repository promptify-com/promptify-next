/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["promptify.s3.amazonaws.com"],
    minimumCacheTTL: 60 * 60,
  },
  eslint: {
    dirs: ['common', 'assets', 'core', 'hooks', 'styles', 'themes', 'pages'],
  },
  poweredByHeader: false
};

if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_SENTRY_DSN &&
  process.env.SENTRY_AUTH_TOKEN
) {
  const { withSentryConfig } = require("@sentry/nextjs");

  nextConfig.sentry = {
    hideSourceMaps: true,
  };

  module.exports = withSentryConfig(nextConfig, {
    org: "matious-corp",
    project: "promptify-web-production",
    silent: true,
    authToken: process.env.SENTRY_AUTH_TOKEN,
  });
} else {
  module.exports = nextConfig;
}
