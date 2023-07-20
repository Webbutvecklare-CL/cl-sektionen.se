/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  version: "1.0.1", // Increment this version with each deployment to bust cache
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  experimental: {
    appDir: true,
  },
  productionBrowserSourceMaps: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
