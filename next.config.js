/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["placehold.it", "promptify.s3.amazonaws.com"],
  },
  eslint: {
    dirs: ['common', 'assets', 'core', 'hooks', 'styles', 'themes', 'pages'],
  },
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
