/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["placehold.it", "promptify.s3.amazonaws.com"],
    minimumCacheTTL: 60 * 60,
  },
  experimental: {
    optimizePackageImports: [ "@emotion/react",
    "@emotion/styled",
    "@fontsource/poppins",
    "@fontsource/space-mono",
    "@microsoft/fetch-event-source",
    "@mui/icons-material",
    "@mui/lab",
    "@mui/material",
    "@netlify/plugin-nextjs",
    "@react-oauth/google",
    "@reduxjs/toolkit",
    "@sentry/nextjs",
    "@types/node",
    "@types/react",
    "@types/react-dom",
    "@types/react-syntax-highlighter",
    "@types/yup",
    "axios",
    "draft-js",
    "elkjs",
    "eslint",
    "eslint-config-next",
    "formik",
    "httpsnippet",
    "isomorphic-dompurify",
    "material-dynamic-colors",
    "next",
    "next-redux-wrapper",
    "polished",
    "react",
    "react-dnd",
    "react-dnd-html5-backend",
    "react-dom",
    "react-github-login",
    "react-highlight-within-textarea",
    "react-image-crop",
    "react-linkedin-login-oauth2",
    "react-redux",
    "react-syntax-highlighter",
    "remark",
    "remark-html",
    "rete",
    "rete-area-plugin",
    "rete-auto-arrange-plugin",
    "rete-connection-plugin",
    "rete-react-render-plugin",
    "rete-render-utils",
    "sharp",
    "styled-components",
    "typescript",
    "usehooks-ts",
    "web-worker",
    "yup"]
  },
  eslint: {
    dirs: ['common', 'assets', 'core', 'hooks', 'styles', 'themes', 'pages'],
  },
};

module.exports = nextConfig;

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
