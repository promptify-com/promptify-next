/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "promptify.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "d20puxs4zqc773.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "insights.hotjar.com",
      },
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "assets-global.website-files.com",
      },
      {
        protocol: "https",
        hostname: "uploads-ssl.webflow.com",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      }
    ],
    minimumCacheTTL: 3600,
  },
  poweredByHeader: false,
};

if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.SENTRY_AUTH_TOKEN) {
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
