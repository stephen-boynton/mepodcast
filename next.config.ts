import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    TADDY_API_URL: process.env.TADDY_API_URL,
    TADDY_USER_ID: process.env.TADDY_USER_ID,
    TADDY_API_KEY: process.env.TADDY_API_KEY,
  },
  images: {
    domains: ["images.unsplash.com", "megaphone.imgix.net"],
  },
};

export default nextConfig;
