/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  transpilePackages: ["@mcpc/core", "@mcpc/react"],
};

module.exports = nextConfig;
