/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["placehold.it", "promptify.s3.amazonaws.com"],
    minimumCacheTTL: 60 * 60,
  },
  experimental: {
    optimizePackageImports: [
    "@emotion/react",
    "@emotion/styled",
    "@mui/icons-material",
    "@mui/lab",
    "@mui/material",
    "styled-components"]
  },
  eslint: {
    dirs: ['common', 'assets', 'core', 'hooks', 'styles', 'themes', 'pages'],
  },
};
const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
})
module.exports = withPlugins([
  [withBundleAnalyzer],
  nextConfig
])

// if (
//   process.env.NODE_ENV === "productionasd" &&
//   process.env.NEXT_PUBLIC_SENTRY_DSN &&
//   process.env.SENTRY_AUTH_TOKEN
// ) {
//   const { withSentryConfig } = require("@sentry/nextjs");

//   nextConfig.sentry = {
//     hideSourceMaps: true,
//     widenClientFileUpload: true,
//     transpileClientSDK: false,
//     tunnelRoute: "/monitoring",
//     disableLogger: true
//   };

//   module.exports = withSentryConfig(nextConfig, {
//     org: "matious-corp",
//     project: "promptify-web-production",
//     silent: true,
//     authToken: process.env.SENTRY_AUTH_TOKEN,
//   });
// } else {
//   module.exports = nextConfig;
// }
