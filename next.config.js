/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["placehold.it", "promptify.s3.amazonaws.com"],
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

  const sentryWebpackPluginOptions = {
    org: "matious-corp",
    project: "promptify-web-production",
    silent: true,
    authToken: process.env.SENTRY_AUTH_TOKEN,
  };

  module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
} else {
  module.exports = nextConfig;
}
