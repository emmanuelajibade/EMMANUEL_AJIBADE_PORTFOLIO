import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  // Webpack watch options for network drives
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000, // Check for changes every 1 second
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;